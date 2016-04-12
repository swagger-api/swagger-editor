'use strict';

var _ = require('lodash');

/**
 * Manages fold state of nodes in the YAML and preview pane
 * The state of the folds are kept in $rootScope.specs itself.
*/
SwaggerEditor.service('FoldStateManager', function FoldStateManager(ASTManager,
  Editor, $rootScope) {
  Editor.onFoldChanged(foldChangedInEditor);
  this.foldEditor = foldEditor;
  this.getFoldedTree = getFoldedTree;

  /**
   * Adds or removes a fold in Ace editor with given path
   *
   * @param {array<string>} path - a list of keys to reach to the node that
   * needs to be folded/unfolded
   *
   * @param {boolean} fold - true to fold the node and false to unfold it
   *
  */
  function foldEditor(path, fold) {
    ASTManager.positionRangeForPath($rootScope.editorValue, path)
    .then(function(range) {
      // Editor API is 0-indexed. Because of this we're subtracting 1 from line
      // numbers
      if (fold) {
        Editor.addFold(range.start.line - 1, range.end.line - 1);
      } else {
        Editor.removeFold(range.start.line - 1, range.end.line - 1);
      }
    });
  }

  /**
   * Responder to fold change events in Ace editor
   *
   * @param {object} event - Ace editor's fold change event. It has a data
   * object that includes the location of the fold and an action property that
   * describes the type of event(fold or unfold)
   *
  */
  function foldChangedInEditor(event) {
    // Editor API is 0-indexed. Because of this we're adding 1 to line numbers
    var position = {
      line: event.data.start.row + 1,
      column: event.data.start.column + 1
    };

    ASTManager.pathForPosition($rootScope.editorValue, position)
    .then(function(path) {
      var $folded = event.action === 'add';

      // walk down the tree to reach to our specific node in spec
      var current = $rootScope.specs;
      while (path.length && _.isObject(current)) {
        current = current[path.shift()];
      }

/* eslint no-implicit-coercion: [2, { "allow": ["!!", "~"] } ]*/
      if (_.isObject(current)) {
        current.$folded = !!$folded;
        $rootScope.$apply();
      }
    });
  }

  /**
   * Get fold state tree of spec
   *
   * @param {object} tree - tree
   * @param {object} newTree - newTree
   *
   * @return {object} object
  */
  function getFoldedTree(tree, newTree) {
    if (!tree) {
      return tree;
    }

    var result = {};

    _.keys(tree).forEach(function(key) {
      if (_.isObject(tree[key]) && _.isObject(newTree[key])) {
        result[key] = getFoldedTree(tree[key], newTree[key]);
      } else if (key === '$folded') {
        result[key] = tree[key];
      } else {
        result[key] = newTree[key];
      }
    });

    return result;
  }
});
