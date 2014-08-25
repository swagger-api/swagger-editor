'use strict';

PhonicsApp.service('Backend', ['$http', '$q', 'defaults', Backend]);

function Backend($http, $q, defaults) {
  var changeListeners =  Object.create(null);
  var buffer = Object.create(null);
  var commit = _.throttle(commitNow, 200);

  function commitNow(data) {
    if (!buffer.error && buffer.specs) {
      $http.put(defaults.backendEndpoint, data);
    }
  }

  this.save = function (key, value) {

    if (!value) {
      return;
    }

    // Save values in a buffer
    buffer[key] = value;

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
        commit(buffer[key]);
      }
    }

  };

  this.reset = noop;

  this.load = function (key) {
    if (key !== 'specs') {
      var deferred = $q.defer();
      if (!key) {
        deferred.reject();
      } else {
        deferred.resolve(buffer[key]);
      }
      return deferred.promise;
    }

    return $http.get(defaults.backendEndpoint)
      .then(function (res) {
        if (defaults.useYamlBackend) {
          buffer.yaml = res.data;
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
