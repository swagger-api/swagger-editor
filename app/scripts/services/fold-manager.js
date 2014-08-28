'use strict';

/*
  Manage fold status of the paths and operations
*/
PhonicsApp.service('FoldManager', function FoldManager(Editor, FoldPointFinder) {
  var buffer = Object.create(null);
  var changeListeners = [];

  Editor.ready(renewBuffer);

  /*
  ** Update buffer with changes from editor
  */
  function refreshBuffer() {
    _.defaults(FoldPointFinder.findFolds(Editor.getValue()), buffer);
    emitChanges();
  }

  /*
  ** Flush buffer and put new value in the buffer
  */
  function renewBuffer(value) {
    value = value || Editor.getValue();
    if (angular.isString(value)) {
      buffer = FoldPointFinder.findFolds(value);
      emitChanges();
    }
  }

  /*
  ** Let event listeners know there was a change in fold status
  */
  function emitChanges() {
    changeListeners.forEach(function (fn) {
      fn();
    });
  }

  /*
  ** Walk the buffer tree for a given path
  */
  function walk(keys, current) {
    current = buffer;

    if (!Array.isArray(keys) || !keys.length) {
      throw new Error('Need path for fold in fold buffer');
    }

    while (keys.length) {
      if (!current || !current.subFolds) {
        return null;
      }
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

  /*
  ** Scan the specs tree and extend objects with order value
  ** We use 'x-row' as an order indication so rendered will ignore it
  ** because it's a vendor extension
  */
  function extendSpecs(specs, path) {
    var fold = null;
    var key;

    if (!path) {
      path = [];
    } else {
      path = _.clone(path);
    }

    // Only apply order value to objects
    if (angular.isObject(specs)) {

      // For each object in this object
      for (key in specs) {

        // Ignore prototype keys
        if (specs.hasOwnProperty(key)) {

          // add key to path and try looking up the tree with this path
          // for the fold corresponding the same object
          fold = walk(path.concat(key));

          // If fold exists append it to the object and push the key to path
          if (fold) {
            specs[key]['x-row'] = fold.start;
          }

          // Recessively do this until the end of the tree
          specs[key] = extendSpecs(specs[key], path.concat(key));
        }
      }
    }

    // Return modified object
    return specs;
  }

  /*
  ** Listen to fold changes in editor and reflect it in buffer
  */
  Editor.onFoldChanged(function (change) {
    var row = change.data.start.row;
    var folded = change.action !== 'remove';
    var fold = scan(buffer, row);

    if (fold) {
      fold.folded = folded;
    }

    refreshBuffer();
    emitChanges();
  });

  /*
  ** Toggle a fold status and reflect it in the editor
  */
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

    refreshBuffer();
  };

  /*
  ** Return status of a fold with given path parameters
  */
  this.isFolded = function () {
    var keys = [].slice.call(arguments, 0);
    var fold = walk(keys);

    return fold && fold.folded;
  };

  /*
  ** Fold status change listener installer
  */
  this.onFoldStatusChanged = function (fn) {
    changeListeners.push(fn);
  };

  // Expose the methods externally
  this.reset = renewBuffer;
  this.refresh = refreshBuffer;
  this.extendSpecs = extendSpecs;
});
