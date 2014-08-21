'use strict';

PhonicsApp.controller('FileImportCtrl', [
  '$scope',
  '$modalInstance',
  'FileLoader',
  '$localStorage',
  'Storage',
  'Editor',
  'FoldManager',
  FileImportCtrl
]);

function FileImportCtrl($scope, $modalInstance, FileLoader, $localStorage, Storage, Editor, FoldManager) {
  var results;

  $scope.fileChanged = function ($fileContent) {
    results = FileLoader.load($fileContent);
  };

  $scope.ok = function () {
    if (typeof results === 'object') {
      Editor.setValue(results);
      Storage.save('specs', results);
      FoldManager.reset();
    }
    $modalInstance.close();
  };

  $scope.isInvalidFile = function () {
    return results === null;
  };

  $scope.isFileSelected = function () {
    return !!results;
  };

  $scope.cancel = $modalInstance.close;
}
