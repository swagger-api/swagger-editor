'use strict';

PhonicsApp.service('Backend', ['$http', 'defaults', Backend]);

function Backend($http, defaults) {

  this.put = function (data) {
    return $http.put(defaults.backendEndpoint, data);
  };
}
