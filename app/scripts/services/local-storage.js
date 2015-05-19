'use strict';

SwaggerEditor.service('LocalStorage', function LocalStorage($localStorage, $q) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners =  {};

  $localStorage[storageKey] = $localStorage[storageKey] || {};

  /*
   *
  */
  function save(key, value) {
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

      if (key === 'yaml') {
        save('progress', 'success-saved');
      }
    }, 100)();
  }

  /*
   *
  */
  function load(key) {
    var deferred = $q.defer();

    if (!key) {
      deferred.resolve($localStorage[storageKey]);
    } else {
      deferred.resolve($localStorage[storageKey][key]);
    }

    return deferred.promise;
  }

  /*
   *
  */
  function addChangeListener(key, fn) {
    if (angular.isFunction(fn)) {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  }

  this.save = save;
  this.reset = $localStorage.$reset;
  this.load = load;
  this.addChangeListener = addChangeListener;
});
