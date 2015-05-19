'use strict';

/*
 * Checks for backend health and set "progress" value accordingly
*/
SwaggerEditor.service('BackendHealthCheck', function BackendHealthCheck($http,
  $interval, defaults, Storage) {
  var isHealthy = true;

  this.startChecking = function () {
    if (!defaults.useBackendForStorage) {
      return;
    }
    $interval(function () {
      $http.get(window.location.href).then(
        function onSuccess() {
          isHealthy = true;
        },
        function onError() {
          isHealthy = false;
          Storage.save('progress', 'error-connection');
        }
      );
    }, defaults.backendHealthCheckTimeout || 5000);
  };

  this.isHealthy = function () {
    return isHealthy;
  };
});
