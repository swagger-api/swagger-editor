'use strict';

PhonicsApp.service('FoldPointFinder', [FoldPointFinder]);

function FoldPointFinder() {
  var TAB_SIZE = 2;
  var tab = '  ';

  this.findFolds = function findFolds(yamlString) {
    var lines = yamlString.split('\n');

    // Return up to 3 level
    return { subFolds: getFolds(lines, 2, 0) };
  };

  // TODO: needs refactoring
  function getFolds(lines, level, offset) {
    var folds = Object.create(null);
    var currentFold = null;
    var key, l, line, foldLines, subFolds;

    for (l = 0; l < lines.length; l++) {
      line = lines[l];

      if (line.substr(0, TAB_SIZE) !== tab) {
        key = line.trim();

        if (!key || key.lastIndexOf(':') !== key.length - 1) { continue; }

        if (key[key.length - 1] === ':') {
          key = key.substring(0, key.length - 1);
        }

        if (currentFold === null) {
          currentFold = {
            start: l + offset,
            folded: false,
            end: null
          };
          folds[key] = currentFold;
        } else {
          addSubFoldsAndEnd();

          currentFold = {
            start: l + offset,
            end: null
          };
          folds[key] = currentFold;
        }
      }
    }

    addSubFoldsAndEnd();

    function addSubFoldsAndEnd() {
      if (currentFold !== null) {
        currentFold.end = l - 1 + offset;
        if (level > 0) {
          foldLines = lines.slice(currentFold.start + 1, currentFold.end).map(indent);
          subFolds = getFolds(foldLines, level - 1, currentFold.start + 1);
          currentFold.subFolds = subFolds;

          if (!_.isEmpty(subFolds)) {
            currentFold.subFolds = subFolds;
          }
        }
      }
    }

    function indent(l) {
      return l.substring(TAB_SIZE);
    }

    return folds;
  }
}
