'use strict';

var angular = require("angular");

SwaggerEditor.controller('FileImportCtrl', function FileImportCtrl($scope,
  $uibModalInstance, $rootScope, $localStorage, $state, FileLoader, Storage) {
  var results;

  $scope.fileChanged = function($fileContent) {
    FileLoader.load($fileContent).then(function(res) {
      $scope.$apply(function() {
        results = res;
      });
    });
  };

  $scope.ok = function() {
    if (angular.isString(results)) {
      $rootScope.editorValue = results;
      Storage.save('yaml', results);
      $state.go('home', {tags: null});
    }
    $uibModalInstance.close();
  };

  $scope.isInvalidFile = function() {
    return results === null;
  };

  $scope.isFileSelected = function() {
    return Boolean(results);
  };

  $scope.cancel = $uibModalInstance.close;
});
