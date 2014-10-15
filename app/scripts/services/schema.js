'use strict';

PhonicsApp.service('Schema', function ($http, $q, defaults) {
  var cache = null;

  function getLatest() {
    return $http.get(defaults.schemaUrl).then(function (resp) {
      cache = resp.data;
    });
  }

  this.get = function () {
    var deferred = $q.defer();

    if (cache) {
      deferred.resolve(cache);
    } else {
      getLatest().then(function () {
        deferred.resolve(cache);
      });
    }

    return deferred.promise;
  };
});
