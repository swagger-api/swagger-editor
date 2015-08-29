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

    SwaggerApi.create({definition: json}).then(function (api) {
      $scope.canImport = true;
      $scope.error = null;

      if (!api.validate()) {
        $scope.error = api.getLastErrors()[0];
      }
      $scope.$digest();
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
