'use strict';

/**
 * @ngdoc service
 * @name SwaggerEditor.preferences
 * @description
 * # preferences
 * Service in the phonicsApp.
 */
SwaggerEditor.service('Preferences', function Preferences($localStorage) {
  var defaultPreferences = {

    /*
     * Update the preview pane per keypress if it's true, otherwise after value
     * change in the editor, a "Reload" button will show up in preview pane
    */
    liveRender: true
  };
  var preferences = $localStorage.preferences || defaultPreferences;

  function save() {
    $localStorage.preferences = preferences;
  }

  this.get = function (key) {
    return preferences[key];
  };

  this.set = function (key, value) {
    if (value === undefined) {
      throw new Error('value was undefined');
    }
    preferences[key] = value;
    save();
  };

  this.reset = function () {
    preferences = defaultPreferences;
    save();
  };

  this.getAll = function () {
    return preferences;
  };
});
