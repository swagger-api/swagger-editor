'use strict';

PhonicsApp.controller('OpenExamplesCtrl', [
  'FileLoader',
  'Builder',
  'Storage',
  'Editor',
  'defaults',
  '$scope',
  '$modalInstance',
  OpenExamplesCtrl
]);

function OpenExamplesCtrl(FileLoader, Builder, Storage, Editor, defaults, $scope, $modalInstance) {

  $scope.files = defaults.exampleFiles;
  $scope.selectedFile = defaults.exampleFiles[0];

  $scope.open = function (file) {
    FileLoader.loadFromUrl('spec-files/' + file).then(function (value){
      var result = Builder.buildDocsWithObject(value);
      Editor.setValue(result.specs);
      Storage.save('specs', result.specs);
      Storage.save('error', result.error);
      $modalInstance.close();
    }, $modalInstance.close);
  };

  $scope.cancel = $modalInstance.close;
}
