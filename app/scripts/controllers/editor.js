'use strict';

PhonicsApp.controller('EditorCtrl', function EditorCtrl($scope, Editor, Builder, Storage, FoldManager) {
  var debouncedOnAceChange = _.debounce(onAceChange, 1000);
  $scope.aceLoaded = Editor.aceLoaded;
  $scope.aceChanged = function () {
    Storage.save('progress', 0);
    debouncedOnAceChange();
  };
  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      Editor.setValue(yaml);
      FoldManager.reset(yaml);
      onAceChange();
    });
  });

  $(document).on('pane-resize', Editor.resize.bind(Editor));

  function onAceChange() {
    var value = Editor.getValue();
    var yaml = jsyaml.load(value);
    Storage.save(yaml.info.title, value);
    Storage.save('yaml', value);
    FoldManager.refresh();
  }
});
