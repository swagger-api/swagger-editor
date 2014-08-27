'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', '$stateParams', 'Editor', 'Builder', 'Storage', 'FoldManager', EditorCtrl]);

function EditorCtrl($scope, $stateParams, Editor, Builder, Storage, FoldManager) {
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function () {
    Storage.load('specs').then(function (specs) {
      var result;
      var value = Editor.getValue();

      if (!$stateParams.path) {
        result = Builder.buildDocs(value);
      } else {
        result = Builder.updatePath(value, $stateParams.path, specs);
      }

      Storage.save('yaml', value);
      Storage.save('specs', result.specs);
      Storage.save('error', result.error);

      FoldManager.refresh();
    });
  };

  Editor.ready(function () {
    Storage.load('yaml').then(function (specs) {
      if ($stateParams.path) {
        Editor.setValue(Builder.getPath(specs, $stateParams.path));
      } else {
        Editor.setValue(specs);
      }

      FoldManager.reset();
    });
  });

  $(document).on('pane-resize', Editor.resize.bind(Editor));
}
