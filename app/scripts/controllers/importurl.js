'use strict';

SwaggerEditor.controller('UrlImportCtrl', function FileImportCtrl($scope,
  $modalInstance, $localStorage, $rootScope, $state, FileLoader, Storage,
  ASTManager) {
  var results;

  $scope.url = null;
  $scope.opts = {
    useProxy: true
  };

  function fetch(url) {
    $scope.error = null;
    $scope.canImport = false;

    if (_.startsWith(url, 'http')) {
      FileLoader.loadFromUrl(url, !$scope.opts.useProxy).then(function (data) {
        results = data;
        $scope.canImport = true;
      }, function (error) {
        $scope.error = error;
        $scope.canImport = false;
      });
    } else {
      $scope.error = 'Invalid URL';
    }
  }

  $scope.fetch = _.throttle(fetch, 200);

  $scope.ok = function () {
    if (angular.isString(results)) {
      Storage.save('yaml', results);
      $rootScope.editorValue = results;
      ASTManager.refresh($rootScope.editorValue);
      $state.go('home', {tags: null});
    }
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});
