'use strict';

/**
 * Manages fold state of nodes in the YAML and preview pane
 * The state of the folds are kept in $rootScope.specs itself.
*/
SwaggerEditor.service('FoldStateManager', function FoldStateManager(ASTManager,
  Editor, $rootScope) {

  Editor.onFoldChanged(foldChangedInEditor);
  this.foldEditor = foldEditor;

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
    .then(function (range) {

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
    .then(function (path) {
      var $folded = event.action === 'add';

      // walk down the tree to reach to our specific node in spec
      var current = $rootScope.specs;
      while (path.length && _.isObject(current)) {
        current = current[path.shift()];
      }

      if (_.isObject(current)) {
        current.$folded = !!$folded;
        $rootScope.$apply();
      }
    });
  }
});
