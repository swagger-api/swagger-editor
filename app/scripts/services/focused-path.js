'use strict';

/*
 * Focused Path provider
 * using AST Manager and Editor information provides path to elements
 * that are in focus in the editor line of code to focus in the editor
 * for a given path
*/
PhonicsApp.service('FocusedPath', function FocusedPath(ASTManager, Editor) {

  /*
   * A path is in focus if it's key or **any** sub path of it is in focus
   * @param {array} - an array of strings pointing to a node in specs tree
   * @returns {boolean} - If path is in focus returns true otherwise returns
   *  false
  */
  this.isInFocus = function (path) {
    var focusedLine = Editor.lineInFocus();
    var focusedPath = ASTManager.pathForLine(focusedLine);

    return Array.isArray(focusedPath) &&
      _.isEqual(path, focusedPath.slice(0, path.length));
  };
});
