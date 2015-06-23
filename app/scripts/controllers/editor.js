'use strict';

SwaggerEditor.controller('EditorCtrl', function EditorCtrl($scope, $rootScope,
  Editor, Builder, Storage, ASTManager, ExternalHooks, Preferences) {

  var debouncedOnAceChange = getDebouncedOnAceChange();

  // if user changed the preferences of keyPressDebounceTime, update the
  // debouncedOnAceChange function to have the latest debounce value
  Preferences.onChange(function (key) {
    if (key === 'keyPressDebounceTime') {
      debouncedOnAceChange = getDebouncedOnAceChange();
    }
  });

  function getDebouncedOnAceChange() {
    return _.debounce(onAceChange, Preferences.get('keyPressDebounceTime'));
  }

  $scope.aceLoaded = Editor.aceLoaded;

  $scope.aceChanged = function () {
    Storage.save('progress', 'progress-working');
    debouncedOnAceChange();
  };

  Editor.ready(function () {
    Storage.load('yaml').then(function (yaml) {
      $rootScope.editorValue = yaml;
      onAceChange(true);
    });
  });

  function onAceChange() {
    var value = $rootScope.editorValue;

    Storage.save('yaml', value);
    ASTManager.refresh($rootScope.editorValue);
    ExternalHooks.trigger('code-change', []);
  }
});
