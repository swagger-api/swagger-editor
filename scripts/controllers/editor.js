'use strict';

var _ = require('lodash');

SwaggerEditor.controller('EditorCtrl', function EditorCtrl($scope, $rootScope,
  Editor, Builder, Storage, ExternalHooks, Preferences) {
  var debouncedOnAceChange = getDebouncedOnAceChange();

  // if user changed the preferences of keyPressDebounceTime, update the
  // debouncedOnAceChange function to have the latest debounce value
  Preferences.onChange(function(key) {
    if (key === 'keyPressDebounceTime') {
      debouncedOnAceChange = getDebouncedOnAceChange();
    }
  });

  /**
   * Get Debounced On Ace Change.
   * @return {function} returns debounced unchanged function
  */
  function getDebouncedOnAceChange() {
    return _.debounce(onAceChange, Preferences.get('keyPressDebounceTime'));
  }

  $scope.aceLoaded = Editor.aceLoaded;

  $scope.aceChanged = function() {
    $rootScope.progressStatus = 'progress-working';
    debouncedOnAceChange();
  };

  Editor.ready(function() {
    Storage.load('yaml').then(function(yaml) {
      $rootScope.editorValue = yaml;
      onAceChange(true);
    });
  });

  /** When there is a change on ace */
  function onAceChange() {
    var value = $rootScope.editorValue;

    Storage.save('yaml', value);
    ExternalHooks.trigger('code-change', []);
  }
});
