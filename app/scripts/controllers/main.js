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
    var editor = null;
    var jsonPreview = null;
    $scope.previewMode = 'html';
    $scope.editorErrorMessage = '';
    $scope.invalidDocs = false;
    $scope.emptyDocs = false;

    $scope.aceLoaded = function(e) {
      editor = e;
      $(document).on('pane-resize', editor.resize.bind(editor));
      if($localStorage.cache){
        editor.getSession().setValue($localStorage.cache);
        builder.buildDocs($scope, $localStorage.cache);
      } else {
        $scope.resetSpec();
      }
    };

    $scope.jsonPreviewLoaded = function(e){
      jsonPreview = e;
    };

    function saveToLocalStorage(value){
      _.debounce(function(){
        window.requestAnimationFrame(function(){
          $localStorage.cache = value;
        });
      },500);
    }

    $scope.aceChanged = function() {
      $scope.invalidDocs = false;
      $scope.emptyDocs = false;
      var error = null;
      var value = editor.getSession().getValue();
      saveToLocalStorage(value);
      if(!value){
        $scope.emptyDocs = true;
        return;
      }

      error = editorHelper.annotateYAMLErrors(editor);
      if(error) {
        $scope.invalidDocs = true;
        return;
      }else{
        $scope.editorErrorMessage = '';
      }
      builder.buildDocs($scope, editor.getSession().getValue());
    };

    $scope.switchPreviewMode = function(language){
      $scope.previewMode = language;
      if(language === 'json'){
        $scope.jsonPreview.getSession().setValue(getJsonString(editor));
      }
    };

    $scope.jsonLoaded = function(){};

    $scope.newProject = function(){
      editor.getSession().setValue('');
      $scope.apiDeclarations = [];
      builder.buildDocs($scope, '');
    };

    $scope.resetSpec = function(){
      loadPreDefinedSpecs('default_full').then(function(yaml){
        $localStorage.cache = yaml;
        editor.getSession().setValue(yaml);
        builder.buildDocs($scope, editor.getSession().getValue());
      });
    };

    $scope.assignDownloadHrefs = function(){
      download.assignDownloadHrefs($scope, editor, jsonPreview);
    };

    $scope.generateZip = function(type, kind){
      var url = 'http://generator.wordnik.com/online/api/gen/' + type + '/' + kind;
      var specs = jsyaml.load(editor.getSession().getValue());
      specs = wrap.model(specs);
      specs = wrap.opts(specs);
      download.getZipFile(url, specs);
    };

  }]);


