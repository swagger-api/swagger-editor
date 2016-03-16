'use strict';

SwaggerEditor.service('LocalStorage', function LocalStorage($localStorage,
  $rootScope) {

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
        $rootScope.progressStatus = 'success-saved';
      }
    }, 100)();
  }

  /*
   *
  */
  function load(key) {
    return new Promise(function (resolve) {
      if (!key) {
        resolve($localStorage[storageKey]);
      } else {
        resolve($localStorage[storageKey][key]);
      }
    });
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
