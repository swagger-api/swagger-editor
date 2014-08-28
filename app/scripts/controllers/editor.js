'use strict';

PhonicsApp.controller('EditorCtrl', function EditorCtrl($scope, $stateParams, Editor, Builder, Storage, FoldManager) {
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

      if (result.error && result.error.yamlError) {
        Editor.annotateYAMLErrors(result.error.yamlError);
      } else {
        Editor.clearAnnotation();
      }

      FoldManager.refresh();
    });
  };

  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      if ($stateParams.path) {
        Editor.setValue(Builder.getPath(yaml, $stateParams.path));
      } else {
        Editor.setValue(yaml);
      }

      FoldManager.reset(yaml);
      Storage.save('yaml', yaml);
    });
  });

  $(document).on('pane-resize', Editor.resize.bind(Editor));
});
