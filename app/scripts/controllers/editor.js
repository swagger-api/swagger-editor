'use strict';

PhonicsApp.controller('EditorCtrl', function EditorCtrl($scope, $rootScope,
  Editor, Builder, Storage, ASTManager, Preferences) {
  var debouncedOnAceChange = _.debounce(onAceChange, 200);

  $scope.aceLoaded = Editor.aceLoaded;

  $scope.aceChanged = function () {
    Storage.save('progress', 0);
    debouncedOnAceChange();
  };

  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      $rootScope.editorValue = yaml;
      onAceChange();
    });
  });

  function onAceChange() {
    var value = $rootScope.editorValue;

    if (!Preferences.get('liveRender')) {
      Storage.save('isDirty', true);
      return;
    }

    Storage.save('yaml', value);
    ASTManager.refresh();
  }
});
