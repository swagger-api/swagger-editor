'use strict';

SwaggerEditor.controller('OpenExamplesCtrl', function OpenExamplesCtrl($scope,
  $modalInstance, $rootScope, FileLoader, Builder, Storage, ASTManager,
  defaults) {

  $scope.files = defaults.exampleFiles;
  $scope.selectedFile = defaults.exampleFiles[0];

  $scope.open = function (file) {
    FileLoader.loadFromUrl('spec-files/' + file).then(function (value) {
      Storage.save('yaml', value);
      ASTManager.refresh(value);
      $rootScope.editorValue = value;
      $modalInstance.close();
    }, $modalInstance.close);
  };

  $scope.cancel = $modalInstance.close;
});
