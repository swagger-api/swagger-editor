'use strict';

/*
 * Manages the AST representation of the specs for fold status
 * and other meta information about the specs tree
*/
PhonicsApp.service('ASTManager', function ASTManager(Editor) {
  var MAP_TAG = 'tag:yaml.org,2002:map';
  var SEQ_TAG = 'tag:yaml.org,2002:seq';
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
   * Walk the ast for a given path
   * @param {array} path - list of keys to follow to reach to reach a node
   * @param {object} current - only used for recursive calls
   * @returns {object} - the node that path is pointing to
  */
  function walk(path, current) {
    var key;
    current = current || ast;

    if (!Array.isArray(path)) {
      throw new Error('Need path to find the node in the AST');
    }

    if (!path.length) {
      return current;
    }

    key = path.shift();

    // If current is a map, search in mapping tuples and find the
    // one that it's first member equals the one
    if (current.tag === MAP_TAG) {
      for (var i = 0; i < current.value.length; i++) {
        var val = current.value[i];

        if (val[0].value === key) {
          return walk(path, val[1]);
        }
      }

    // If current is a sequence (array), return item with index
    // that is equal to key. `key` should be an int
    } else if (current.tag === SEQ_TAG) {
      key = parseInt(key, 10);
      current = current.value[key];
      return walk(path, current);
    }

    return current;
  }

  /*
   * Beneath first search the AST and finds the node that has the same
   * start line number
   * @param {object} current  - optional, AST o search in it. used for
   *  recursive calls
   * @returns {object} - the node that has the same start line or null
   *  if node wasn't found
  */
  function scan(current, start) {
    var val;
    current = current || ast;

    if (!angular.isObject(current) || !current.value) {
      return current;
    }

    /* jshint camelcase: false */
    if (current.start_mark.line === start) {
      return current;
    }

    for (var i = 0; i < current.value.length; i++) {
      if (current.tag === MAP_TAG) {
        val = scan(current.value[i][1], start);
      } else if (current.tag === SEQ_TAG) {
        val = scan(current.value[i], start);
      }
      if (val) {
        return val;
      }
    }

    return null;
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
   * Listen to fold changes in editor and reflect it in the AST
   * then emit AST change event to trigger rendering in the preview
   * pane
  */
  Editor.onFoldChanged(function (change) {
    var row = change.data.start.row + 1;
    var folded = change.action !== 'remove';
    var node = scan(ast, row);

    if (node) {
      node.folded = folded;
    }

    emitChanges();
  });

  /*
   * Toggle a fold status and reflect it in the editor
   * @param {array} path - an array of string that is path to a node
   *   in the AST
  */
  this.toggleFold = function (path) {
    var node = walk(path, ast);

    /* jshint camelcase: false */

    // Guard against when walk fails
    if (!node || !node.start_mark) {
      return;
    }

    // Remove the fold from the editor if node is folded
    if (node.folded) {
      Editor.removeFold(node.start_mark.line);
      node.folded = false;

    // Add fold to editor if node is not folded
    } else {
      Editor.addFold(node.start_mark.line - 1, node.end_mark.line - 1);
      node.folded = true;
    }

    // Let other components know changes happened
    emitChanges();
  };

  /*
   * Return status of a fold with given path parameters
   * @param {array} path - an array of string that is path to a node
   *   in the AST
   * @return {boolean} - true if the node is folded, false otherwise
  */
  this.isFolded = function (path) {
    var node = walk(path, ast);

    return angular.isObject(node) && !!node.folded;
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
