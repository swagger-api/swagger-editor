'use strict';

SwaggerEditor.controller('FileImportCtrl', function FileImportCtrl($scope,
  $modalInstance, $rootScope, $localStorage, $state, FileLoader, Storage) {
  var results;

  $scope.fileChanged = function ($fileContent) {
    FileLoader.load($fileContent).then(function (res) {
      $scope.$apply(function () {
        results = res;
      });
    });
  };

  $scope.ok = function () {
    if (angular.isString(results)) {
      $rootScope.editorValue = results;
      Storage.save('yaml', results);
      $state.go('home', {tags: null});
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
});
