'use strict';

PhonicsApp.service('FoldPointFinder', [FoldPointFinder]);

function FoldPointFinder() {
  var TAB_SIZE = 2;
  var tab = '  ';

  /*
  ** Find folds from YAML sting
  */
  this.findFolds = function findFolds(yamlString) {
    var lines = yamlString.split('\n');

    // Return up to 3 level
    return { subFolds: getFolds(lines, 5, 0) };
  };

  /*
  ** Get folds from and array of lines
  */
  function getFolds(lines, level, offset) {
    var folds = Object.create(null);
    var currentFold = null;
    var key, l, line;

    // Iterate in lines
    for (l = 0; l < lines.length; l++) {
      line = lines[l];

      // If line is not indented it can be an object key or a key: value pair
      if (line.substr(0, TAB_SIZE) !== tab) {
        key = line.trim();

        // Cover the case that key is quoted. Example: "/user/{userId}":
        if ((key[0] === '"') && (key[key.length - 2] === '"') && (key[key.length - 1] === ':')) {
          key = key.substring(1, key.length - 2) + ':';
        }

        // If colon is not the last character it's not an object key
        if (!key || key.lastIndexOf(':') !== key.length - 1) {
          continue;
        }

        // Omit colon character
        if (key[key.length - 1] === ':') {
          key = key.substring(0, key.length - 1);
        }

        // If there is no current fold in progress initiate one
        if (currentFold === null) {
          currentFold = {
            start: l + offset,
            folded: false,
            end: null
          };
          folds[key] = currentFold;

        // else, add middle folds recessively and close current fold in progress
        } else {
          addSubFoldsAndEnd(lines, l, currentFold, level, offset);

          currentFold = {
            start: l + offset,
            end: null
          };
          folds[key] = currentFold;
        }
      }
    }

    // In case there is a current fold in progress finish it
    addSubFoldsAndEnd(lines, l, currentFold, level, offset);

    return folds;
  }

  /*
  ** Adds subfolds and finish fold in progress
  */
  function addSubFoldsAndEnd(lines, l, currentFold, level, offset) {
    var foldLines, subFolds;

    // If there is a current fold, otherwise nothing to do
    if (currentFold !== null) {

      // set end property which is current line + offset
      currentFold.end = l - 1 + offset;

      // If it's not too deep
      if (level > 0) {

        // Get fold lines and remove the indent in
        foldLines = lines.slice(currentFold.start + 1, currentFold.end).map(indent);

        // Get subFolds recursively
        subFolds = getFolds(foldLines, level - 1, currentFold.start + 1);

        // If results are not empty assign it
        if (!_.isEmpty(subFolds)) {
          currentFold.subFolds = subFolds;
        }
      }
    }
  }

  /*
  ** Removes indent of a line one tab
  */
  function indent(l) {
    return l.substring(TAB_SIZE);
  }
}
