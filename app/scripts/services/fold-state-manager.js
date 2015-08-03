'use strict';

/**
 * Manages fold state of nodes in the YAML
*/
SwaggerEditor.service('FoldStateManager', function FoldStateManager(ASTManager,
  Editor, $sessionStorage, $rootScope) {

  /**
   *
  */
  function toggle(path) {

    isFolded(path).then(function (folded) {
      changeFold(path, !folded);
    });
  }

  /**
   *
  */
  function isFolded(path) {
    return ASTManager.positionRangeForPath($rootScope.editorValue, path)
    .then(function (range) {
      return Editor.getAllFolds().some(function (fold) {
        return range.start.line === fold.start.row &&
          range.end.line === fold.end.row;
      });
    });
  }

  function changeFold(path, fold) {
    ASTManager.positionRangeForPath($rootScope.editorValue, path)
      .then(function (range) {
        if (fold) {
          Editor.addFold(range.start.line, range.end.line);
        } else {
          Editor.removeFold(range.start.line);
        }
      });
  }

  this.toggle = toggle;
  this.isFolded = isFolded;
});
