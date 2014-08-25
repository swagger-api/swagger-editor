'use strict';

PhonicsApp.service('FoldPointFinder', [FoldPointFinder]);

function FoldPointFinder() {
  var TAB_SIZE = 2;
  var tab = '  ';

  this.findFolds = function findFolds(yamlString) {
    var lines = yamlString.split('\n');

    // Return up to 3 level
    return getFolds(lines, 2);
  };

  // TODO: needs refactoring
  function getFolds(lines, level) {
    var folds = Object.create(null);
    var currentFold = null;
    var key, l, line, foldLines, subFolds;

    for (l = 0; l < lines.length; l++) {
      line = lines[l];

      if (line.substr(0, TAB_SIZE) !== tab) {
        key = line.trim();

        if (!key || key.match(/.+\:./)) { continue; }

        key = key.replace(':', '');

        if (currentFold === null) {
          currentFold = {
            start: l,
            end: null
          };
          folds[key] = currentFold;
        } else {
          currentFold.end = l - 1;

          if (level > 0) {
            foldLines = lines.slice(currentFold.start + 1, currentFold.end).map(indent);
            subFolds = getFolds(foldLines, level - 1);

            if (!_.isEmpty(subFolds)) {
              currentFold.subFolds = subFolds;
            }
          }

          currentFold = {
            start: l,
            end: null
          };
          folds[key] = currentFold;
        }
      }
    }

    if (currentFold !== null) {
      currentFold.end = l - 1;
      if (level > 0) {
        foldLines = lines.slice(currentFold.start + 1, currentFold.end).map(indent);
        subFolds = getFolds(foldLines, level - 1);
        currentFold.subFolds = subFolds;
      }
    }

    function indent(l) {
      return l.substring(TAB_SIZE);
    }

    return folds;
  }
}
