'use strict';

PhonicsApp.controller('FileImportCtrl', [
  '$scope',
  '$modalInstance',
  'FileLoader',
  '$localStorage',
  'Storage',
  'Editor',
  FileImportCtrl
]);

function FileImportCtrl($scope, $modalInstance, FileLoader, $localStorage, Storage, Editor){
  var results;

  $scope.fileChanged = function ($fileContent) {
    results = FileLoader.load($fileContent);
  };

  $scope.ok = function () {
    if(typeof results === 'object') {
      Editor.setValue(results);
      Storage.save('specs', results);
    }
    $modalInstance.close();
  };

  $scope.isInvalidFile = function(){
    return results === null;
  };

  $scope.isFileSelected = function() {
    return !!results;
  };

  $scope.cancel = $modalInstance.close;
}
