'use strict';

PhonicsApp.controller('HeaderCtrl', ['$scope', 'Editor', 'Builder', 'FileLoader', '$localStorage', 'Splitter', '$modal',
  function HeaderCtrl($scope, Editor, Builder, FileLoader, $localStorage, splitter, $modal) {

    function assignDownloadHrefs($scope, editor){
      var MIME_TYPE = 'text/plain';

      // JSON
      var json = jsyaml.load(editor.getSession().getValue());
      var prettyJson = JSON.stringify(json, null, 2);
      var jsonBlob = new Blob([prettyJson], {type: MIME_TYPE});
      $scope.jsonDownloadHref = window.URL.createObjectURL(jsonBlob);
      $scope.jsonDownloadUrl = [MIME_TYPE, 'spec.json', $scope.jsonDownloadHref].join(':');

      // YAML
      var yamlBlob = new Blob([editor.getSession().getValue()], {type: MIME_TYPE});
      $scope.yamlDownloadHref = window.URL.createObjectURL(yamlBlob);
      $scope.yamlDownloadUrl = [MIME_TYPE, 'spec.yaml', $scope.yamlDownloadHref].join(':');
    }

    function getZipFile(url, json){
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: url,
        data: JSON.stringify(json),
        processData: false
      }).then(function(data){
        if (data instanceof Object && data.code){
          window.location = 'http://generator.wordnik.com/online/api/gen/download/' + data.code;
        }
      });
    }

    $scope.newProject = function(){
      Editor.setValue('');
      Builder.buildDocs($scope, '');
    };

    $scope.resetSpec = function(){
      FileLoader.loadFromUrl('default').then(function(yaml){
        $localStorage.cache = yaml;
        Editor.getSession().setValue(yaml);
        Builder.buildDocs($scope, Editor.getSession().getValue());
      });
    };

    $scope.assignDownloadHrefs = function(){
      assignDownloadHrefs($scope, Editor);
    };

    $scope.generateZip = function(type, kind){
      // TODO put the URL in enums module
      var url = 'http://generator.wordnik.com/online/api/gen/' + type + '/' + kind;
      var specs = jsyaml.load(Editor.getSession().getValue());

      getZipFile(url, specs);
    };

    $scope.togglePane = function (side) {
      splitter.toggle(side);
    };

    $scope.isPaneVisible = function (side) {
      return splitter.isVisible(side);
    };

    $scope.openImport = function(){
      $modal.open({
        templateUrl: 'templates/import.html',
        controller: 'ImportCtrl',
        size: 'large'
      });
    };
  }
]);
