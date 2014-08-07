'use strict';

PhonicsApp.controller('HeaderCtrl', [
  '$scope',
  'Editor',
  'Storage',
  'FileLoader',
  'Splitter',
  '$modal',
  HeaderCtrl
]);


function HeaderCtrl($scope, Editor, Storage, FileLoader, Splitter, $modal) {
  $scope.newProject = function(){
    Editor.setValue('');
    Storage.reset();
  };

  $scope.resetSpec = function(){
    FileLoader.loadFromUrl('spec-files/default.yaml').then(function(yamlObject){
      Editor.setValue(yamlObject);
      Storage.save(yamlObject);
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
    Splitter.toggle(side);
  };

  $scope.isPaneVisible = function (side) {
    return Splitter.isVisible(side);
  };

  $scope.openImport = function(){
    $modal.open({
      templateUrl: 'templates/import.html',
      controller: 'ImportCtrl',
      size: 'large'
    });
  };
}


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
      // TODO put fixed URL in enums
      window.location = 'http://generator.wordnik.com/online/api/gen/download/' + data.code;
    }
  });
}
