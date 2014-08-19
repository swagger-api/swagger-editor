'use strict';

PhonicsApp.service('Backend', ['$http', 'defaults', Backend]);

function Backend($http, defaults) {
  var changeListeners =  Object.create(null);
  var specsBuffer = null;
  var commit = _.throttle(_commit, 200);

  function _commit(){
    $http.put(defaults.backendEndpoint, specsBuffer);
  }


  this.save = function (key, value) {
    if (Array.isArray(changeListeners[key])) {
      changeListeners[key].forEach(function (fn) {
        fn(value);
      });
    }

    if (key === 'specs' && value) {
      specsBuffer = value;
      commit();
    }
  };

  this.reset = noop;

  this.load = function () {
    return $http.get(defaults.backendEndpoint)
      .then(function (res) {
        return res.data;
      });
  };

  this.addChangeListener = function (key, fn) {
    if (typeof fn === 'function') {
      if (!changeListeners[key]) {
        changeListeners[key] = [];
      }
      changeListeners[key].push(fn);
    }
  };
}

function noop() {

}
