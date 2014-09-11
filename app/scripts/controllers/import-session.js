'use strict';

PhonicsApp.controller('LocalStorageImportCtrl', function LocalStorageImportCtrl(FileLoader, Builder, Storage, Editor, FoldManager, defaults, $scope, $modalInstance) {

  $scope.files = Storage.getKeys();
  $scope.selectedFile = $scope.yaml;

  $scope.open = function (key) {
    Storage.load(key).then(function (value) {
      var yaml = jsyaml.load(value);
      Storage.save(yaml.info.title, value);
      Storage.save('yaml', value);
      Editor.setValue(value);
      FoldManager.reset();
      $modalInstance.close();
    }, $modalInstance.close);
  };

  $scope.cancel = $modalInstance.close;
});
