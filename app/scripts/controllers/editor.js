'use strict';

PhonicsApp.controller('EditorCtrl', function EditorCtrl($scope, Editor, Builder,
  Storage, ASTManager) {
  var debouncedOnAceChange = _.debounce(onAceChange, 1000);

  $scope.aceLoaded = Editor.aceLoaded;

  $scope.aceChanged = function () {
    Storage.save('progress', 0);
    debouncedOnAceChange();
  };

  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      Editor.setValue(yaml);
      onAceChange();
    });
  });

  function onAceChange() {
    var value = Editor.getValue();

    Storage.save('yaml', value);
    ASTManager.refresh();
  }
});
