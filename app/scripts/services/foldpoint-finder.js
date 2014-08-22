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
    var keys = [], folds = {}, key, l, line;
    for (l = 0; l < lines.length; l++) {
      line = lines[l];

      if (line.substr(0, TAB_SIZE) !== tab) {
        key = line.trim();

        if (!key || key.match(/.+\:./)) { continue; }

        if (!keys.length) {
          keys.push({
            key: key.replace(':', ''),
            start: l,
            end: null
          });
        } else {
          keys[keys.length - 1].end = l - 1;
          keys.push({
            key: key.replace(':', ''),
            start: l,
            end: null
          });
        }
      }
    }
    keys[keys.length - 1].end = l - 1;
    keys.forEach(function (k) {
      folds[k.key] = {start: k.start, end: k.end};
    });

    return folds;
  }
}
