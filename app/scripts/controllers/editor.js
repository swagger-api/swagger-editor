'use strict';

PhonicsApp.controller('EditorCtrl', ['$scope', '$stateParams', 'Editor', 'Builder', 'Storage', EditorCtrl]);

function EditorCtrl($scope, $stateParams, Editor, Builder, Storage) {
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

      Storage.save('specs', result.specs);
      Storage.save('error', result.error);
    });
  };

  Editor.ready(function () {
    Storage.load('specs').then(function (specs) {
      if ($stateParams.path) {
        Editor.setValue(Builder.getPath(specs, $stateParams.path));
      } else {
        Editor.setValue(specs);
      }
    });
  });

  $(document).on('pane-resize', Editor.resize.bind(Editor));
}
