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

  function getFolds(lines) {
    var folds = {}, currentFold = null, key, l, line;

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
    }

    return folds;
  }
}
