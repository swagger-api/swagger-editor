'use strict';

/*
 * Code Generator service
*/
SwaggerEditor.service('Codegen', function Codegen($http, defaults, Storage,
  YAML) {
  this.getServers = function () {
    if (!defaults.codegen.servers) {
      return new Promise(function (resolve) { resolve([]); });
    }
    return $http.get(defaults.codegen.servers).then(function (resp) {
      return resp.data;
    });
  };

  this.getClients = function () {
    if (!defaults.codegen.clients) {
      return new Promise(function (resolve) { resolve([]); });
    }
    return $http.get(defaults.codegen.clients).then(function (resp) {
      return resp.data;
    });
  };

  this.getSDK = function (type, language) {

    var url = defaults.codegen[type].replace('{language}', language);

    return Storage.load('yaml').then(function (yaml) {
      YAML.load(yaml, function (error, spec) {
        $http.post(url, {spec: spec}).then(redirect);
      });
    });
  };

  function redirect(resp) {
    if (angular.isObject(resp.data) && resp.data.link) {
      window.location = resp.data.link;
    }
  }
});
