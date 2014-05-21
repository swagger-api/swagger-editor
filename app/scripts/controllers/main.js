'use strict';
/* global jsyaml */

// Use single curly brace for templates (used in spec)
_.templateSettings = {
  interpolate: /\{(.+?)\}/g
};

var ENABLE_JSON_PREVIEW = false;

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

function buildapiDeclarationDocs(declraton){
  var swaggerUi = null;
  swaggerUi = new SwaggerUi({
    'dom_id': 'swagger-ui-container-' + Math.floor(Math.random()*100),
    supportedSubmitMethods: ['get', 'post', 'put', 'delete']
  });

  swaggerUi.load(JSON.stringify(declraton));
  return _.clone(swaggerUi.api);
}

function buildDocs($scope){
  var json;

  $scope.invalidDocs = false;
  try {
    json = jsyaml.load($scope.editor.getSession().getValue());
  }catch(e){
    $scope.invalidDocs = true;
    return;
  }
  if(json && Array.isArray(json.apiDeclarations)){
    $scope.apiDeclarations = json.apiDeclarations.map(buildapiDeclarationDocs);
  }

  if($scope.jsonPreview && ENABLE_JSON_PREVIEW) {
    $scope.jsonPreview.getSession().setValue(getJsonString($scope.editor));
  }
}


function getDefaultSpecs(){
  return $.get('spec-files/consolidated-from-json.yaml');
}

function getZipFile(url, json){
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: url,
    data: JSON.stringify(json),
    processData: false
  }).then(function(data){
    window.location = 'http://generator.wordnik.com/online/api/gen/download/' + data.code;
  });
}

PhonicsApp.controller('MainCtrl', ['$scope', '$localStorage', function ($scope, $localStorage) {
    $scope.editor = null;
    $scope.jsonPreview = null;
    $scope.previewMode = 'html';
    $scope.editorErrorMessage = '';
    $scope.invalidDocs = false;

    $scope.aceLoaded = function(editor) {
      $scope.editor = editor;
      // editor.setOptions({
      //   basicAutocompletion: true
      // });
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
        $scope.invalidDocs = true;
        return;
      }else{
        $scope.editorErrorMessage = '';
      }
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

    $scope.assignDownloadHrefs = function(){
      var MIME_TYPE = 'text/plain';

      // JSON
      var jsonBlob = new Blob([$scope.jsonPreview.getSession().getValue()], {type: MIME_TYPE});
      $scope.jsonDownloadHref = window.URL.createObjectURL(jsonBlob);
      $scope.jsonDownloadUrl = [MIME_TYPE, 'spec.json', $scope.jsonDownloadHref].join(':');

      // YAML
      var yamlBlob = new Blob([$scope.editor.getSession().getValue()], {type: MIME_TYPE});
      $scope.yamlDownloadHref = window.URL.createObjectURL(yamlBlob);
      $scope.yamlDownloadUrl = [MIME_TYPE, 'spec.yaml', $scope.yamlDownloadHref].join(':');
    };

    $scope.generateZip = function(type, kind){
      var url = 'http://generator.wordnik.com/online/api/gen/' + type + '/' + kind;
      // FIXME how we should generate properties in this object based on document?
      var json = {
        opts: {
          properties: {
            modelPackage: 'com.reverb.models',
            apiPackage: 'com.reverb.apis',
            groupId: 'com.reverb.swagger',
            artifactId: 'swagger-client',
            artifactVersion: '1.0.0',
          }
        },
        model: _.extend(jsyaml.load($scope.editor.getSession().getValue()),
        {
          apiVersion: '5.0.0-D0',
          swaggerVersion: '1.2',
          authorizations: {
            oauth2:{
              type: 'oauth2',
              scopes:{
                scope: 'write',
                description: 'write to your albums'
              },
              grantTypes:{
                implicit:{
                  loginEndpoint:{
                    url: 'http://petstore.swagger.wordnik.com/oauth/dialog'
                  },
                  tokenName: 'access_token'
                }
              }
            }
          }
        })
      };

      getZipFile(url, json);
    };

  }]);


