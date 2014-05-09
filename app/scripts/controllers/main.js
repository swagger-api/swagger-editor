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
  return JSON.stringify(jsyaml.load(editor.getSession().getValue()));
}

function buildDocs($scope){
  if(!swaggerUi) { return; }

  var jsonString = getJsonString($scope.editor);

  swaggerUi.load(jsonString);
  swaggerUi.render();
}


function getDefaultSpecs(){
  return $.get('spec-files/default.yaml');
}

PhonicsApp.controller('MainCtrl', ['$scope', '$localStorage', function ($scope, $localStorage) {
    $scope.editor = null;
    $scope.previewMode = 'html';
    $scope.editorErrorMessage = '';
    $scope.autogenDocs = true;

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

    $scope.aceChanged = _.debounce(function() {
      var error = null;
      $localStorage.cache = $scope.editor.getSession().getValue();

      error = annotateYAMLErrors($scope.editor);
      if(!error) {
        $scope.editorErrorMessage = '';
      }
      if($scope.autogenDocs){
        buildDocs($scope);
      }
    }, 500);

    $scope.generateDocs = function(){
      buildDocs($scope);
    };

    $scope.switchPreviewMode = function(language){
      $scope.previewMode = language;
    };

    $scope.jsonLoaded = function(){};

  }]);


