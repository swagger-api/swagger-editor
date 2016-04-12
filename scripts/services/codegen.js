'use strict';

var angular = require('angular');

/*
 * Code Generator service
*/
SwaggerEditor.service('Codegen', function Codegen($http, defaults, Storage,
  YAML) {
  this.getServers = function() {
    if (!defaults.codegen.servers) {
      return new Promise(function(resolve) {
        resolve([]);
      });
    }
    return $http.get(defaults.codegen.servers).then(function(resp) {
      return resp.data;
    });
  };

  this.getClients = function() {
    if (!defaults.codegen.clients) {
      return new Promise(function(resolve) {
        resolve([]);
      });
    }
    return $http.get(defaults.codegen.clients).then(function(resp) {
      return resp.data;
    });
  };

  this.getSDK = function(type, language) {
    var url = defaults.codegen[type].replace('{language}', language);

    return new Promise(function(rsolve, reject) {
      Storage.load('yaml').then(function(yaml) {
        YAML.load(yaml, function(error, spec) {
          if (error) {
            return reject(error);
          }
          $http.post(url, {spec: spec}).then(function redirect(resp) {
            if (angular.isObject(resp.data) && resp.data.link) {
              window.location = resp.data.link;
              rsolve();
            } else {
              reject('Bad response from server: ' + JSON.stringify(resp));
            }
          }, reject);
        });
      });
    });
  };
});
