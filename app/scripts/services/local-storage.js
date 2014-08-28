'use strict';

PhonicsApp.service('LocalStorage', function LocalStorage($localStorage, $q) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners =  Object.create(null);

  $localStorage[storageKey] = $localStorage[storageKey] || Object.create(null);

  this.save = function (key, value) {
    if (value === null) {
      return;
    }

    if (Array.isArray(changeListeners[key])) {
      changeListeners[key].forEach(function (fn) {
        fn(value);
      });
    }

    _.debounce(function () {
      window.requestAnimationFrame(function () {
        $localStorage[storageKey][key] = value;
      });
    }, 100)();
  };

  this.reset = function () {
    $localStorage[storageKey] = Object.create(null);
  };

  this.load = function (key) {
    var deferred = $q.defer();
    if (!key) {
      deferred.resolve($localStorage[storageKey]);
    } else {
      deferred.resolve($localStorage[storageKey][key]);
    }

    return deferred.promise;
  };

  this.addChangeListener = function (key, fn) {
    if (typeof fn === 'function') {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };
});
