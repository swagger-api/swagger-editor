'use strict';

/*
 * Checks for backend health and set "progress" value accordingly
*/
PhonicsApp.service('BackendHealthCheck', function BackendHealthCheck($http,
  $interval, defaults, Storage) {
  var isHealthy = true;

  this.startChecking = function () {
    $interval(function () {
      $http.get(window.location.href).then(
        function onSuccess() {
          isHealthy = true;
        },
        function onError() {
          isHealthy = false;
          Storage.save('progress', -2);
        }
      );
    }, defaults.backendHelathCheckTimeout);
  };

  this.isHealthy = function () {
    return isHealthy;
  };
});
