'use strict';
/* global jsyaml */
/* global jsonlint */

function annotateYAMLErrors(editor){
  var errorMessage = null;
  var value = editor.getSession().getValue();
  try {
    jsyaml.load(value);
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

function annotateJSONErrors(editor){
  var errorMessage = null;
  var value = editor.getSession().getValue();
  var line = 0;
  try {
    jsonlint.parse(value);
  } catch (jsonParseError){
    errorMessage = jsonParseError.message;
    try {
      line = parseInt(errorMessage.split('\n')[0]
        .replace('Parse error on line ', '').replace(':', ''), 10);
    } catch (e) {}
    editor.getSession().setAnnotations([{
      row: line,
      column: 0,
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
  $scope.editingLanguage = 'yaml';
  $scope.editorErrorMessage = '';

  $scope.aceLoaded = function(editor) {
    $scope.editor = editor;
  };

  $scope.aceChanged = function() {
    var error = null;
    if($scope.editingLanguage === 'yaml') {
      error = annotateYAMLErrors($scope.editor);
    }
    if($scope.editingLanguage === 'json') {
      error = annotateJSONErrors($scope.editor);
    }
    if(!error) {
      $scope.editorErrorMessage = '';
    }
  };

  $scope.switchToLanguage = function(language){
    var currentValue = $scope.editor.getSession().getValue();
    var newValue = null;
    if(language === 'yaml'){
      $scope.editorErrorMessage = annotateJSONErrors($scope.editor);
      if ($scope.editorErrorMessage) {
        return;
      }
      newValue = JSON.parse(currentValue);
      newValue = jsyaml.dump(newValue);
    }
    if(language === 'json'){
      $scope.editorErrorMessage = annotateYAMLErrors($scope.editor);
      if ($scope.editorErrorMessage) {
        return;
      }
      newValue = jsyaml.load(currentValue);
      newValue = JSON.stringify(newValue, null, 2);
    }
    if($scope.editorErrorMessage) {
      return;
    }
    $scope.editingLanguage = language;
    $scope.editor.getSession().setMode(language);
    $scope.editor.getSession().setValue(newValue);
  };

});


