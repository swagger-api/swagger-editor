'use strict';

PhonicsApp.service('Backend', ['$http', 'defaults', Backend]);

function Backend($http, defaults) {
  var changeListeners =  Object.create(null);
  var specsBuffer = null;
  var commit = _.throttle(commitNow, 200);

  function commitNow(data) {
    $http.put(defaults.backendEndpoint, data);
  }

  this.save = function (key, value) {
    if (Array.isArray(changeListeners[key])) {
      changeListeners[key].forEach(function (fn) {
        fn(value);
      });
    }

    if (defaults.useYamlBackend) {
      if (key === 'yaml' && value) {
        commit(value);
      }
    } else {
      if (key === 'specs' && value) {
        specsBuffer = value;
        commit(specsBuffer);
      }
    }

  };

  this.reset = noop;

  this.load = function () {
    return $http.get(defaults.backendEndpoint)
      .then(function (res) {
        if (defaults.useYamlBackend) {
          return jsyaml.load(res.data);
        }
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
