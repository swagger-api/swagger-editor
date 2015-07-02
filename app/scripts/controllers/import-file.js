'use strict';

SwaggerEditor.controller('FileImportCtrl', function FileImportCtrl($scope,
  $modalInstance, $rootScope, $localStorage, $state, FileLoader, Storage,
  ASTManager) {
  var results;

  $scope.fileChanged = function ($fileContent) {
    results = FileLoader.load($fileContent);
  };

  $scope.ok = function () {
    if (angular.isString(results)) {
      $rootScope.editorValue = results;
      Storage.save('yaml', results);
      $state.go('home', {tags: null});
      ASTManager.refresh($rootScope.editorValue);
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
