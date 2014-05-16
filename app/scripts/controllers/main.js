'use strict';
/* global jsyaml */

// Use single curly brace for templates (used in spec)
_.templateSettings = {
  interpolate: /\{(.+?)\}/g
};

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


function getJsonString(editor){
  var specsObject = jsyaml.load(editor.getSession().getValue());
  return JSON.stringify(specsObject, null, 4);
}

function buildDocs($scope){
  if(!swaggerUi) { return; }
  $scope.invalidDocs = false;

  var jsonString = getJsonString($scope.editor);

  try{
    swaggerUi.load(jsonString);
  }catch(swaggerLoadError){
    return $scope.invalidDocs = true;
  }
  $scope.swagger = swaggerUi.api;
}


function getDefaultSpecs(){
  return $.get('spec-files/pet.yaml');
}

PhonicsApp.controller('MainCtrl', ['$scope', '$localStorage', function ($scope, $localStorage) {
    $scope.editor = null;
    $scope.jsonPreview = null;
    $scope.previewMode = 'html';
    $scope.editorErrorMessage = '';
    $scope.invalidDocs = false;

    window.swaggerUi = new SwaggerUi({
      'dom_id': 'swagger-ui-container',
      supportedSubmitMethods: ['get', 'post', 'put', 'delete']
    });

    $scope.aceLoaded = function(editor) {
      $scope.editor = editor;
      $(document).on('pane-resize', editor.resize.bind(editor));
      if($localStorage.cache){
        editor.getSession().setValue($localStorage.cache);
      } else {
        return $scope.resetSpec();
      }
      buildDocs($scope);
    };

    $scope.jsonPreviewLoaded = function(jsonPreview){
      $scope.jsonPreview = jsonPreview;
    };

    $scope.aceChanged = function() {
      var error = null;
      $localStorage.cache = $scope.editor.getSession().getValue();

      error = annotateYAMLErrors($scope.editor);
      if(error) {
        return $scope.invalidDocs = true;
      }else{
        $scope.editorErrorMessage = '';
      }
      buildDocs($scope);
    };

    $scope.generateDocs = function(){
      buildDocs($scope);
    };

    $scope.switchPreviewMode = function(language){
      $scope.previewMode = language;
      if(language === 'json'){
        $scope.jsonPreview.getSession().setValue(getJsonString($scope.editor));
      }
    };

    $scope.jsonLoaded = function(){};

    $scope.newProject = function(){
      $scope.editor.getSession().setValue('');
      buildDocs($scope);
    };

    $scope.resetSpec = function(){
      getDefaultSpecs().then(function(yaml){
        $localStorage.cache = yaml;
        $scope.editor.getSession().setValue(yaml);
        buildDocs($scope);
      });
    };

  }]);


