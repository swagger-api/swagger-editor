'use strict';

SwaggerEditor.controller('UrlImportCtrl', function FileImportCtrl($scope,
  $modalInstance, $localStorage, $rootScope, FileLoader, Storage, ASTManager) {
  var results;

  $scope.url = null;

  function fetch(url) {
    $scope.error = null;
    $scope.canImport = false;

    if (angular.isString('string') && url.indexOf('http') > -1) {
      FileLoader.loadFromUrl(url).then(function (data) {
        results = data;
        $scope.canImport = true;
      }, function (error) {
        $scope.error = error;
        $scope.canImport = false;
      });
    }
  }

  $scope.fetch = _.throttle(fetch, 200);

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
