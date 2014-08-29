'use strict';

PhonicsApp.controller('EditorCtrl', function EditorCtrl($scope, $stateParams, Editor, Builder, Storage, FoldManager) {
  var debouncedOnAceChange = _.debounce(onAceChange, 1000);
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function () {
    Storage.save('progress', 'Working...');
    debouncedOnAceChange();
  };
  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      if ($stateParams.path) {
        Editor.setValue(Builder.getPath(yaml, $stateParams.path));
      } else {
        Editor.setValue(yaml);
      }

      FoldManager.reset(yaml);
      onAceChange();
    });
  });

  $(document).on('pane-resize', Editor.resize.bind(Editor));

  function onAceChange() {
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
  }
});
