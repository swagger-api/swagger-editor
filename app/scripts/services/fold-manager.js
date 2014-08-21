'use strict';

/*
  Manage fold status of the paths and operations
*/
PhonicsApp.service('FoldManager', ['Editor', FoldManager]);

function FoldManager(Editor) {
  var buffer = {
    info: { fold: null, folded: false },
    paths: { fold: null, folded: false },
    definitions: { fold: null, folded: false }
  };
  var changeListeners = [];

  Editor.ready(rewriteBuffer);

  function rewriteBuffer() {
    var allFolds = Editor.getAllFolds();

    allFolds.forEach(function (fold) {
      var line = Editor.getLine(fold.start.row);

      if (line.trim().indexOf('paths') === 0) {
        buffer.paths.fold = fold;
      }

      if (line.trim().indexOf('info') === 0) {
        buffer.info.fold = fold;
      }

      if (line.trim().indexOf('definitions') === 0) {
        buffer.definitions.fold = fold;
      }

      emitChanges();
    });
  }

  function emitChanges() {
    changeListeners.forEach(function (fn) {
      fn();
    });
  }

  Editor.onFoldChanged(function (change) {
    var key = Editor.getLine(change.data.start.row).trim().replace(':', '');
    var folded = change.action !== 'remove';

    if (buffer[key]) {
      buffer[key].folded = folded;
    }

    emitChanges();
  });

  this.toggleFoldPath = function (pathName) {
    if (buffer.paths[pathName]) {
      buffer.paths[pathName].folded = !buffer.paths[pathName].folded;
    }
  };

  this.isPathFolded = function (pathName) {
    return buffer.paths[pathName].folded;
  };

  this.toggleFold = function (key) {
    if (!buffer[key]) {
      throw new Error('Can not toggle fold ' + key);
    }

    var fold = buffer[key].fold;

    if (buffer[key].folded) {
      Editor.removeFold(fold);
      buffer[key].folded = false;
    } else {
      Editor.addFold(fold);
      buffer[key].folded = true;
    }
  };

  this.isFolded = function (key) {
    return buffer[key].folded;
  };

  this.onFoldStatusChanged = function (fn) {
    changeListeners.push(fn);
  };

  this.reset = rewriteBuffer;
}
