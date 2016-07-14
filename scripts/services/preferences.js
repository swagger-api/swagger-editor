'use strict';

var _ = require('lodash');
var angular = require('angular');

/**
 * @ngdoc service
 * @name SwaggerEditor.preferences
 * @description
 * # preferences
 * Service in the phonicsApp.
 */
SwaggerEditor.service('Preferences', function Preferences($localStorage,
  defaults) {
  var changeListeners = [];

  var defaultPreferences = {

    /*
     * Update the preview pane per keypress if it's true, otherwise after value
     * change in the editor, a "Reload" button will show up in preview pane
    */
    liveRender: true,

    /*
     * Disable/enable auto-compelte functionallity.
    */
    autoComplete: true,

    /*
     * Wait time for editor to react to keyboard events
    */
    keyPressDebounceTime: defaults.keyPressDebounceTime,

    /*
     * JSON Pointer resolution base path
    */
    pointerResolutionBasePath: defaults.pointerResolutionBasePath ||
      location.origin + location.pathname
  };

  var preferences = _.extend(defaultPreferences, $localStorage.preferences);

  var save = function() {
    $localStorage.preferences = preferences;
  };

  this.get = function(key) {
    return preferences[key];
  };

  this.set = function(key, value) {
    if (value === undefined) {
      throw new TypeError('value was undefined');
    }
    preferences[key] = value;
    save();
    changeListeners.forEach(function(fn) {
      fn(key, value);
    });
  };

  this.reset = function() {
    preferences = defaultPreferences;
    save();
  };

  this.getAll = function() {
    return preferences;
  };

  /*
   * A global change hook for preferences change
   *
   * @param {function} fn - the callback function
  */
  this.onChange = function(fn) {
    if (angular.isFunction(fn)) {
      changeListeners.push(fn);
    }
  };
});
