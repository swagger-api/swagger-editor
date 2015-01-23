'use strict';

SwaggerEditor.controller('UrlImportCtrl', function FileImportCtrl($scope,
  $modalInstance, $localStorage, $rootScope, FileLoader, Storage, ASTManager) {
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
      $rootScope.editorValue = results;
      ASTManager.refresh($rootScope.editorValue);
    }
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});
