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

function getJsonString(editor, language){
  var jsonString = null;
  if(language === 'yaml'){
    jsonString = JSON.stringify(jsyaml.load(editor.getSession().getValue()));
  }else{
    jsonString = editor.getSession().getValue();
  }
  return jsonString;
}

function buildDocs($scope){
  if(!swaggerUi) { return; }

  var jsonString = getJsonString($scope.editor, $scope.editingLanguage);

  swaggerUi.load(jsonString);
  swaggerUi.render();
}


function getDefaultSpecs(){
  return $.get('spec-files/default.yaml');
}

PhonicsApp.controller('MainCtrl', ['$scope', '$localStorage', function ($scope, $localStorage) {
    $scope.editor = null;
    $scope.editingLanguage = 'yaml';
    $scope.editorErrorMessage = '';
    $scope.autogenDocs = false;

    window.swaggerUi = new SwaggerUi({
      'dom_id': 'swagger-ui-container',
      supportedSubmitMethods: ['get', 'post', 'put', 'delete']
    });

    $scope.aceLoaded = function(editor) {
      $scope.editor = editor;
      if($localStorage.cache){
        editor.getSession().setValue($localStorage.cache);
      } else {
        return getDefaultSpecs().then(function(yaml){
          $localStorage.cache = yaml;
          editor.getSession().setValue(yaml);
          buildDocs($scope);
        });
      }
      buildDocs($scope);
    };

    $scope.aceChanged = function() {
      var error = null;
      $localStorage.cache = $scope.editor.getSession().getValue();

      if($scope.editingLanguage === 'yaml') {
        error = annotateYAMLErrors($scope.editor);
      }
      if($scope.editingLanguage === 'json') {
        error = annotateJSONErrors($scope.editor);
      }
      if(!error) {
        $scope.editorErrorMessage = '';
      }
      if($scope.autogenDocs){
        buildDocs($scope);
      }
    };

    $scope.generateDocs = function(){
      buildDocs($scope);
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

  }]);


