'use strict';

/*
 * Manages the AST representation of the specs for fold status
 * and other meta information about the specs tree
*/
PhonicsApp.service('ASTManager', function ASTManager(Editor) {
  var ast = {};
  var changeListeners = [];

  // When editor is ready refresh the AST from Editor value
  Editor.ready(refreshAST);

  /*
  ** Update ast with changes from editor
  */
  function refreshAST() {
    ast = yaml.compose(Editor.getValue());
    emitChanges();
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
  ** Walk the ast for a given path
  */
  function walk(path, current) {
    var MAP_TAG = 'tag:yaml.org,2002:map';

    var key;
    current = current || ast;

    if (!Array.isArray(path)) {
      throw new Error('Need path to find the node in the AST');
    }

    if (!path.length) {
      return current;
    }

    key = path.shift();

    if (!current) {
      return null;
    }

    // If current is a map, search in mapping tuples and find the
    // one that it's first member equals the one
    if (current.tag === MAP_TAG) {
      for (var i = 0; i < current.value.length; i++) {
        var val = current.value[i];

        if (val[0].value === key) {
          return walk(path, val[1]);
        }
      }
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
   * return back line number of an specific node with given path
  */
  function lineForPath(path) {
    var node = walk(path);

    if (node) {
      /* jshint camelcase: false */
      return node.start_mark.line;
    }
    return null;
  }

  /*
  ** Listen to fold changes in editor and reflect it in ast
  */
  Editor.onFoldChanged(function (change) {
    var row = change.data.start.row;
    var folded = change.action !== 'remove';
    var fold = scan(ast, row);

    if (fold) {
      fold.folded = folded;
    }

    refreshAST();
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

    refreshAST();
  };

  /*
  ** Return status of a fold with given path parameters
  */
  this.isFolded = function () {
    // FIXME:
    return false;
    // var keys = [].slice.call(arguments, 0);
    // var fold = walk(keys);

    // return fold && fold.folded;
  };

  /*
  ** Fold status change listener installer
  */
  this.onFoldStatusChanged = function (fn) {
    changeListeners.push(fn);
  };

  // Expose the methods externally
  this.refresh = refreshAST;
  this.lineForPath = lineForPath;
});
