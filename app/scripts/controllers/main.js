'use strict';
/* global jsyaml */

function annotateYAMLErrors(editor){
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
  $scope.editingLanguage = 'yaml';
  $scope.editorErrorMessage = '';

  $scope.aceLoaded = function(editor) {
    $scope.editor = editor;
  };

  $scope.aceChanged = function() {
    var error = annotateYAMLErrors($scope.editor);
    if(!error) {
      $scope.editorErrorMessage = '';
    }
  };

  $scope.switchToLanguage = function(language){
    var currentValue = $scope.editor.getSession().getValue();
    var newValue = null;
    if(language === 'yaml'){
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


