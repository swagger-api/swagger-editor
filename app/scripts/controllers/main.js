'use strict';
/* global jsyaml */

function annotateErrors(editor){
  var errorMessage = null;
  var value = editor.getSession().getValue();
  var json = null;
  try {
    json = jsyaml.load(value);
  } catch(yamlLoadError) {
    errorMessage = yamlLoadError.message.replace('JS-YAML: ', '');
    editor.getSession().setAnnotations([{
      row: yamlLoadError.mark.line,
      column: yamlLoadError.mark.column,
      text: errorMessage,
      type: 'error'
    }]);
    return errorMessage;
  }
  editor.getSession().clearAnnotations();
  return errorMessage;
}

PhonicsApp.controller('MainCtrl', function ($scope) {
  $scope.editor = null;
  $scope.editingLanguage = 'yml';
  $scope.editorErrorMessage = '';

  $scope.aceLoaded = function(editor) {
    $scope.editor = editor;
  };

  $scope.aceChanged = function() {
    var error = annotateErrors($scope.editor);
    if(!error) {
      $scope.editorErrorMessage = '';
    }
  };

  $scope.switchToLanguage = function(language){
    var currentValue = $scope.editor.getSession().getValue();
    var newValue = null;
    if(language === 'yml'){
      newValue = JSON.parse(currentValue);
      newValue = jsyaml.dump(newValue);
    }
    if(language === 'json'){
      $scope.editorErrorMessage = annotateErrors($scope.editor);
      newValue = JSON.stringify(newValue, null, 2);
    }
    if($scope.editorErrorMessage) {
      return;
    }
    $scope.editingLanguage = language;
    $scope.editor.getSession().setValue(newValue);
  };

});


