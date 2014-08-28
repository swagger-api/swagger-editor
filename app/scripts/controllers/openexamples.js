'use strict';

PhonicsApp.controller('OpenExamplesCtrl', function OpenExamplesCtrl(FileLoader, Builder, Storage, Editor, FoldManager, defaults, $scope, $modalInstance) {

  $scope.files = defaults.exampleFiles;
  $scope.selectedFile = defaults.exampleFiles[0];

  $scope.open = function (file) {
    FileLoader.loadFromUrl('spec-files/' + file).then(function (value) {
      var result = Builder.buildDocsWithObject(value);
      Editor.setValue(result.specs);
      Storage.save('specs', result.specs);
      Storage.save('error', result.error);
      FoldManager.reset();
      $modalInstance.close();
    }, $modalInstance.close);
  };

  $scope.cancel = $modalInstance.close;
});
