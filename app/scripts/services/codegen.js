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

  this.getServer = function (language) {

    var url = _.template(defaults.codegen.server)({
      language: language
    });

    return Storage.load('yaml').then(function (yaml) {
      var specs = jsyaml.load(yaml);

      return $http.post(url, {swagger: specs}).then(redirect);
    });
  };

  this.getClient = function (language) {

    var url = _.template(defaults.codegen.client)({
      language: language
    });

    return Storage.load('yaml').then(function (yaml) {
      var specs = jsyaml.load(yaml);

      return $http.post(url, {swagger: specs}).then(redirect);
    });
  };

  function redirect(resp) {
    if (angular.isObject(resp) && resp.code) {
      window.location = resp.data.code;
    }
  }
});
