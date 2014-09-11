'use strict';

PhonicsApp.service('LocalStorage', function LocalStorage($localStorage, $q) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners =  Object.create(null);
  var that = this;

  $localStorage[storageKey] = $localStorage[storageKey] || Object.create(null);

  this.getKeys = function () {
      var files = [];
      for (var key in $localStorage[storageKey]) {
          if((key!='intro')&&(key!='progress')&&(key!='yaml'))
            files.push(key);
      }
      return files;
  };

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
