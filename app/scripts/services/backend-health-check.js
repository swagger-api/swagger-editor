'use strict';

/*
 * Checks for backend health and set "progress" value accordingly
*/
PhonicsApp.service('BackendHealthCheck', function BackendHealthCheck($http, $interval, defaults, Storage) {

  this.startChecking = function () {
    $interval(function () {
      $http.get(window.location.href).then(
        function onSuccess() { },
        function onError() { Storage.save('progress', -2); }
      );
    }, defaults.backendHelathCheckTimeout);
  };
});
