'use strict';

PhonicsApp.controller('PasteJSONCtrl', function PasteJSONCtrl($scope,
  $modalInstance, $rootScope, Storage, ASTManager) {

  $scope.$watch('json', function (json) {
    try {
      json = JSON.parse($scope.json);
    } catch (error) {
      $scope.error = error.message;
      $scope.canImport = false;
      return;
    }
    SwaggerTools.specs.v2.validate(json, function (error, result) {
      if (result && result.errors) {
        $scope.error = result.errors;
        $scope.canImport = false;
        return;
      }

      $scope.canImport = true;
      $scope.error = null;
    });
  });

  $scope.ok = function () {
    var result = jsyaml.dump(JSON.parse($scope.json));
    Storage.save('yaml', result);
    $rootScope.editorValue = result;
    ASTManager.refresh($rootScope.editorValue);
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});
