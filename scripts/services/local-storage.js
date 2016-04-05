'use strict';

var _ = require('lodash');
var angular = require('angular');

SwaggerEditor.service('LocalStorage', function LocalStorage($localStorage,
  $rootScope) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners = {};

  $localStorage[storageKey] = $localStorage[storageKey] || {};

  /*
   *
  */
  var save = function(key, value) {
    if (value === null) {
      return;
    }

    if (Array.isArray(changeListeners[key])) {
      changeListeners[key].forEach(function(fn) {
        fn(value);
      });
    }

    _.debounce(function() {
      window.requestAnimationFrame(function() {
        $localStorage[storageKey][key] = value;
      });

      if (key === 'yaml') {
        $rootScope.progressStatus = 'success-saved';
      }
    }, 100)();
  };

  /*
   *
  */
  var load = function(key) {
    return new Promise(function(resolve) {
      if (key) {
        resolve($localStorage[storageKey][key]);
      } else {
        resolve($localStorage[storageKey]);
      }
    });
  };

  /*
   *
  */
  var addChangeListener = function(key, fn) {
    if (angular.isFunction(fn)) {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };

  this.save = save;
  this.reset = $localStorage.$reset;
  this.load = load;
  this.addChangeListener = addChangeListener;
});
