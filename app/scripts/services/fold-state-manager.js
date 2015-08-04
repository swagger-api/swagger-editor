'use strict';

/**
 * Manages fold state of nodes in the YAML
*/
SwaggerEditor.service('FoldStateManager', function FoldStateManager(ASTManager,
  Editor, $rootScope) {

  /**
   *
  */
  this.foldEditor = function foldEditor(path, fold) {
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
  };

  Editor.onFoldChanged(function foldChangedInEditor(event) {
    var position = {
      line: event.data.start.row + 1,
      column: event.data.start.column + 1
    };

    ASTManager.pathForPosition($rootScope.editorValue, position)
    .then(function (path) {
      if (event.action === 'add') {
        // TODO
        console.log(path);
      }

      if (event.action === 'remove') {
        // TODO
        console.log(path);
      }
    });
  });
});
