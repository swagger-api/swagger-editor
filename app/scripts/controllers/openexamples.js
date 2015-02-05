'use strict';

SwaggerEditor.controller('OpenExamplesCtrl', function OpenExamplesCtrl($scope,
  $modalInstance, $rootScope, FileLoader, Builder, Storage, ASTManager,
  Analytics, defaults) {

  $scope.files = defaults.exampleFiles;
  $scope.selectedFile = defaults.exampleFiles[0];

  $scope.open = function (file) {

    Analytics.sendEvent('open-example', 'open-example:' + file);

    FileLoader.loadFromUrl('spec-files/' + file).then(function (value) {
      Storage.save('yaml', value);
      ASTManager.refresh(value);
      $rootScope.editorValue = value;
      $modalInstance.close();
    }, $modalInstance.close);
  };

  $scope.cancel = $modalInstance.close;
});
