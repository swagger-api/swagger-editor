'use strict';

PhonicsApp.service('Storage', ['$localStorage', function Storage($localStorage) {
  var storageKey = 'SwaggerEditorCache';
  var changeListeners = [];

  this.save = function (specs){
    $localStorage[storageKey] = specs;
    changeListeners.forEach(function (fn) {
      fn(specs);
    });
  };

  this.reset = function () {
    $localStorage[storageKey] = null;
  };

  this.load = function (){
    return $localStorage[storageKey];
  };

  this.addChangeListener = function (fn) {
    if (typeof fn === 'function') {
      changeListeners.push(fn);
    }
  };
}]);
