'use strict';

PhonicsApp.controller('UrlImportCtrl', [
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

  $scope.$watch('url', function (url) {
    if (typeof url === 'string' && url.indexOf('http') > -1) {
      FileLoader.loadFromUrl(url).then(function (data) {
        results = data;
        $scope.canImport = true;
      }, function(error) {
        $scope.error = error;
        $scope.canImport = false;
      });
    }
  });

  $scope.ok = function () {
    if(typeof results === 'object') {
      Editor.setValue(results);
      Storage.save(results);
    }
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
}
