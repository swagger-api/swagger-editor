'use strict';

PhonicsApp.controller('ImportCtrl', [
  '$scope',
  '$modalInstance',
  'FileLoader',
  '$localStorage',
  'Storage',
  'Editor',
  ImportController
]);

function ImportController($scope, $modalInstance, FileLoader, $localStorage, Storage, Editor){
  var results;

  $scope.fileChanged = function ($fileContent) {
    results = FileLoader.load($fileContent);
  };

  $scope.ok = function () {
    if(typeof results === 'object') {
      Editor.setValue(results);
      Storage.save(results);
    }
    $modalInstance.close();
  };

  $scope.isInvalidFile = function(){
    return results === null;
  };

  $scope.isFileSelected = function() {
    return !!results;
  }

  $scope.cancel = $modalInstance.close;
}
