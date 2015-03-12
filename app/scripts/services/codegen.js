'use strict';

/*
 * Code Generator service
*/
SwaggerEditor.service('Codegen', function Codegen($http, defaults, Storage) {
  this.getServers = function () {
    return $http.get(defaults.codegen.servers).then(function (resp) {
      return resp.data;
    });
  };

  this.getClients = function () {
    return $http.get(defaults.codegen.clients).then(function (resp) {
      return resp.data;
    });
  };

  this.getSDK = function (type, language) {

    var url = defaults.codegen[type].replace('{language}', language);

    return Storage.load('yaml').then(function (yaml) {
      var specs = jsyaml.load(yaml);

      return $http.post(url, {spec: specs}).then(redirect);
    });
  };

  function redirect(resp) {
    if (angular.isObject(resp.data) && resp.data.link) {
      window.location = resp.data.link;
    }
  }
});
