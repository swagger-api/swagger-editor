'use strict';

PhonicsApp.service('Backend', ['$http', 'defaults', Backend]);

function Backend($http, defaults) {
  var changeListeners =  Object.create(null);
  var buffer = Object.create(null);
  var commit = _.throttle(commitNow, 200);

  function commitNow(data) {
    $http.put(defaults.backendEndpoint, data);
  }

  this.save = function (key, value) {

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

  this.load = function () {
    return $http.get(defaults.backendEndpoint)
      .then(function (res) {
        if (defaults.useYamlBackend) {

          // TODO: Wr are assuming the YAML coming from
          // backend is valid. Validate server's YAML
          buffer.yaml = res.data;
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
