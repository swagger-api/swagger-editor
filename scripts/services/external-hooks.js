'use strict';

var angular = require('angular');

/*
 * Provide external hooks to various events in Swagger Editor
 *
 * # Usage
 * SwaggerEditor.on(EventName, Callback)
*/
SwaggerEditor.service('ExternalHooks', function ExternalHooks() {
  // Hooks hash
  var hooks = {
    'code-change': [], // triggers when code changes
    'put-success': [], // triggers when PUT request to backend succeeds
    'put-failure': []  // triggers when PUT request to backend fails
  };

  /*
   * Hook install method
   *
   * @param {string} eventName
   * @param {function} callback - function to get triggered on event occurrence
  */
  SwaggerEditor.on = function(eventName, callback) {
    if (!angular.isString(eventName)) {
      throw new TypeError('eventName must be string');
    }

    if (!angular.isFunction(callback)) {
      throw new TypeError('callback must be a function');
    }

    if (!hooks[eventName]) {
      throw new Error(eventName + ' is not a valid event name');
    }

    var isRegisteredCallback = hooks[eventName].some(function(cb) {
      return cb === callback;
    });

    if (!isRegisteredCallback) {
      hooks[eventName].push(callback);
    }
  };

  /*
   * Triggers a hook
   * @param {string} eventName - event name to trigger
   * @param {array} args - arguments to trigger callback functions with
  */
  this.trigger = function(eventName, args) {
    if (!angular.isString(eventName)) {
      throw new TypeError('eventName must be string');
    }

    if (!angular.isArray(args)) {
      throw new TypeError('args must be an array');
    }

    if (!hooks[eventName]) {
      throw new Error(eventName + ' is not a valid event name');
    }

    hooks[eventName].forEach(function(callback) {
      callback.apply(null, args);
    });
  };
});
