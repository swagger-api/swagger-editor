'use strict';

SwaggerEditor.controller('PasteJSONCtrl', function PasteJSONCtrl($scope,
  $modalInstance, $rootScope, $state, Storage, ASTManager, SwayWorker) {

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

    SwayWorker.run(json, function (data) {
      $scope.canImport = true;
      $scope.error = null;

      if (data.errors.length) {
        $scope.error = data.errors[0];
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
