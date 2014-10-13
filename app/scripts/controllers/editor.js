'use strict';

PhonicsApp.controller('EditorCtrl', function EditorCtrl($scope, Editor, Builder, Storage, ASTManager) {
  var debouncedOnAceChange = _.debounce(onAceChange, 1000);

  $scope.aceLoaded = Editor.aceLoaded;

  $scope.aceChanged = function () {
    Storage.save('progress', 0);
    debouncedOnAceChange();
  };

  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      Editor.setValue(yaml);
      ASTManager.refresh(yaml);
      onAceChange();
    });
  });

  function onAceChange() {
    var value = Editor.getValue();
    var yaml = jsyaml.load(value);
    Storage.save(yaml.info.title, value);
    Storage.save('yaml', value);
    ASTManager.refresh();
  }
});
