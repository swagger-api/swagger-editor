'use strict';

SwaggerEditor.controller('PasteJSONCtrl', function PasteJSONCtrl($scope,
  $modalInstance, $rootScope, Storage, ASTManager) {

  var json;

  $scope.checkJSON = function (newJson) {
    $scope.canImport = false;

    try {
      json = JSON.parse(newJson);
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
  };

  $scope.ok = function () {
    var result = jsyaml.dump(json);
    Storage.save('yaml', result);
    $rootScope.editorValue = result;
    ASTManager.refresh($rootScope.editorValue);
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});
