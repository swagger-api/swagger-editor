'use strict';

/*
  Manage fold status of the paths and operations
*/
PhonicsApp.service('FoldManager', ['Editor', 'FoldPointFinder', FoldManager]);

function FoldManager(Editor, FoldPointFinder) {
  var buffer = Object.create(null);
  var changeListeners = [];

  Editor.ready(renewBuffer);

  function refreshBuffer() {
    _.extend(buffer, FoldPointFinder.findFolds(Editor.getValue()));
    emitChanges();
  }

  function renewBuffer() {
    buffer = FoldPointFinder.findFolds(Editor.getValue());
    emitChanges();
  }

  function emitChanges() {
    changeListeners.forEach(function (fn) {
      fn();
    });
  }

  function walk(keys) {
    var current = buffer;

    if (!Array.isArray(keys) || !keys.length) {
      throw new Error('Need path for fold in fold buffer');
    }

    while (keys.length) {
      current = current.subFolds[keys.shift()];
    }

    return current;
  }

  /*
  ** Beneath first search for the fold that has the same start
  */
  function scan(current, start) {
    var result = null;
    var node, fold;

    if (current.start === start) {
      return current;
    }

    if (angular.isObject(current.subFolds)) {
      for (var k in current.subFolds) {
        if (angular.isObject(current.subFolds)) {
          node = current.subFolds[k];
          fold = scan(node, start);
          if (fold) {
            result = fold;
          }
        }
      }
    }

    return result;
  }

  Editor.onFoldChanged(function (change) {
    var row = change.data.start.row;
    var folded = change.action !== 'remove';
    var fold = scan(buffer, row);

    fold.folded = folded;

    emitChanges();
  });

  this.toggleFold = function () {
    var keys = [].slice.call(arguments, 0);
    var fold = walk(keys);

    if (fold.folded) {
      Editor.removeFold(fold.start + 1);
      fold.folded = false;
    } else {
      Editor.addFold(fold.start, fold.end);
      fold.folded = true;
    }
  };

  this.isFolded = function () {
    var keys = [].slice.call(arguments, 0);
    var fold = walk(keys);

    return fold && fold.folded;
  };

  this.onFoldStatusChanged = function (fn) {
    changeListeners.push(fn);
  };

  this.reset = renewBuffer;
  this.refresh = refreshBuffer;
}
