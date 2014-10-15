'use strict';

PhonicsApp.controller('UrlImportCtrl', function FileImportCtrl($scope,
  $modalInstance, FileLoader, $localStorage, Storage, Editor, ASTManager) {
  var results;

  $scope.url = null;

  $scope.fetch = function (url) {
    if (angular.isString('string') && url.indexOf('http') > -1) {
      FileLoader.loadFromUrl(url).then(function (data) {
        results = data;
        $scope.canImport = true;
      }, function (error) {
        $scope.error = error;
        $scope.canImport = false;
      });
    }
  };

  $scope.ok = function () {
    if (angular.isString(results)) {
      Storage.save('yaml', results);
      Editor.setValue(results);
      ASTManager.refresh();
    }
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});
