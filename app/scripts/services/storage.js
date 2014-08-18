'use strict';

PhonicsApp.service('Storage', ['$localStorage', function Storage($localStorage) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners =  Object.create(null);

  $localStorage[storageKey] = $localStorage[storageKey] || Object.create(null);

  this.save = function (key, value){
    if (Array.isArray(changeListeners[key])) {
      changeListeners[key].forEach(function (fn) {
        fn(value);
      });
    }

    _.debounce(function () {
      window.requestAnimationFrame(function (){
        $localStorage[storageKey][key] = value;
      });
    }, 100)();
  };

  this.reset = function () {
    $localStorage[storageKey] = Object.create(null);
  };

  this.load = function (key){
    if (!key){
      return $localStorage[storageKey];
    }

    return $localStorage[storageKey][key];
  };

  this.addChangeListener = function (key, fn) {
    if (typeof fn === 'function') {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };
}]);
