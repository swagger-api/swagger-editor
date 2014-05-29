'use strict';

// Use single curly brace for templates (used in spec)
_.templateSettings = {
  interpolate: /\{(.+?)\}/g
};

function getJsonString(editor){
  var specsObject = jsyaml.load(editor.getSession().getValue());
  return JSON.stringify(specsObject, null, 4);
}

function loadPreDefinedSpecs(fileName){
  return $.get('spec-files/' + fileName + '.yaml');
}


PhonicsApp.controller('MainCtrl', ['$scope', '$localStorage',
  'wrap', 'editorHelper', 'downloadHelper', 'builderHelper',
  function ($scope, $localStorage, wrap, editorHelper, download, builder) {
    $scope.blah = '!';
    $scope.editor = null;
    $scope.jsonPreview = null;
    $scope.previewMode = 'html';
    $scope.editorErrorMessage = '';
    $scope.invalidDocs = false;
    $scope.emptyDocs = false;

    $scope.aceLoaded = function(editor) {
      $scope.editor = editor;
      $(document).on('pane-resize', editor.resize.bind(editor));
      if($localStorage.cache){
        editor.getSession().setValue($localStorage.cache);
      } else {
        return $scope.resetSpec();
      }
      builder.buildDocs($scope);
    };

    $scope.jsonPreviewLoaded = function(jsonPreview){
      $scope.jsonPreview = jsonPreview;
    };

    $scope.aceChanged = function() {
      $scope.invalidDocs = false;
      $scope.emptyDocs = false;
      var error = null;
      var value = $scope.editor.getSession().getValue();
      $localStorage.cache = value;
      if(!value){
        $scope.emptyDocs = true;
        return;
      }

      error = editorHelper.annotateYAMLErrors($scope.editor);
      if(error) {
        $scope.invalidDocs = true;
        return;
      }else{
        $scope.editorErrorMessage = '';
      }
      builder.buildDocs($scope);
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
      $scope.apiDeclarations = [];
      builder.buildDocs($scope);
    };

    $scope.resetSpec = function(){
      loadPreDefinedSpecs('default_full').then(function(yaml){
        $localStorage.cache = yaml;
        $scope.editor.getSession().setValue(yaml);
        builder.buildDocs($scope);
      });
    };

    $scope.assignDownloadHrefs = function(){
      download.assignDownloadHrefs($scope);
    };

    $scope.generateZip = function(type, kind){
      var url = 'http://generator.wordnik.com/online/api/gen/' + type + '/' + kind;
      var specs = jsyaml.load($scope.editor.getSession().getValue());
      specs = wrap.model(specs);
      specs = wrap.opts(specs);
      download.getZipFile(url, specs);
    };

  }]);


