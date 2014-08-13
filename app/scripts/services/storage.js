'use strict';

PhonicsApp.service('Storage', ['$localStorage', function Storage($localStorage) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners = {};

  function setSpecs(key, value){

    changeListeners[key].forEach(function (fn) {
      fn(value);
    });

    _.debounce(function() {
      window.requestAnimationFrame(function(){
        $localStorage[storageKey][key] = value;
      });
    }, 100)();
  }

  this.save = function (key, value){
    setSpecs(key, value);
  };

  this.reset = function () {
    $localStorage[storageKey] = null;
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
