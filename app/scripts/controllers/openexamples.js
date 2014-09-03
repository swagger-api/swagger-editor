'use strict';

PhonicsApp.controller('OpenExamplesCtrl', function OpenExamplesCtrl(FileLoader, Builder, Storage, Editor, FoldManager, defaults, $scope, $modalInstance) {

  $scope.files = defaults.exampleFiles;
  $scope.selectedFile = defaults.exampleFiles[0];

  $scope.open = function (file) {
    FileLoader.loadFromUrl('spec-files/' + file).then(function (value) {
      Storage.save('yaml', value);
      Editor.setValue(value);
      FoldManager.reset();
      $modalInstance.close();
    }, $modalInstance.close);
  };

  $scope.cancel = $modalInstance.close;
});
