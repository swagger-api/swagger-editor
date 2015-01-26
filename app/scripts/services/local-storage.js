'use strict';

SwaggerEditor.service('LocalStorage', function LocalStorage($localStorage, $q,
  $rootScope, Embedded) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners =  {};
  var that = this;

  $localStorage[storageKey] = $localStorage[storageKey] || {};

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
    Object.keys($localStorage[storageKey]).forEach(function (key) {
      that.save(key, '');
    });
  };

  this.load = function (key) {
    var deferred = $q.defer();

    // if we are in docs only mode and load is called for `yaml` use Embedded
    // service to get embedded document
    if ($rootScope.mode === 'docs-only' && key === 'yaml' && Embedded.get()) {
      deferred.resolve(Embedded.get());
    } else if (!key) {
      deferred.resolve($localStorage[storageKey]);
    } else {
      deferred.resolve($localStorage[storageKey][key]);
    }

    return deferred.promise;
  };

  this.addChangeListener = function (key, fn) {
    if (angular.isFunction(fn)) {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };
});
