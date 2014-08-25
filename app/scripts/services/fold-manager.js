'use strict';

/*
  Manage fold status of the paths and operations
*/
PhonicsApp.service('FoldManager', ['Editor', 'FoldPointFinder', FoldManager]);

function FoldManager(Editor, FoldPointFinder) {
  var buffer = {
    info: { fold: null, folded: false },
    paths: { fold: null, folded: false },
    definitions: { fold: null, folded: false }
  };
  var changeListeners = [];

  Editor.ready(rewriteBuffer);

  function rewriteBuffer() {
    buffer = FoldPointFinder.findFolds(Editor.getValue());
    emitChanges();
  }

  function emitChanges() {
    changeListeners.forEach(function (fn) {
      fn();
    });
  }


  function walk(keys) {
    var key, current = buffer;

    while(keys.length) {
      key = keys.shift();
      if (!current.subFolds[key]) {
        throw new Error('Can not toggle fold ' + key);
      }

      if (current.subFolds[key]) {
        current = current.subFolds[key];
      }
    }

    return current;
  }

  Editor.onFoldChanged(function (change) {
    var key = Editor.getLine(change.data.start.row).trim().replace(':', '');
    var folded = change.action !== 'remove';

    if (buffer[key]) {
      buffer[key].folded = folded;
    }

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

  this.reset = rewriteBuffer;
}
