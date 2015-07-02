'use strict';

SwaggerEditor.controller('PasteJSONCtrl', function PasteJSONCtrl($scope,
  $modalInstance, $rootScope, $state, Storage, ASTManager) {

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
      $scope.canImport = true;
      $scope.error = null;

      if (result && result.errors) {
        $scope.error = result.errors;
        return;
      }
    });
  };

  $scope.ok = function () {
    var result = jsyaml.dump(json);
    Storage.save('yaml', result);
    $rootScope.editorValue = result;
    ASTManager.refresh($rootScope.editorValue);
    $state.go('home', {tags: null});
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});
