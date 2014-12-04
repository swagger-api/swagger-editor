'use strict';

/*
 * Manages Authentications
*/
PhonicsApp.service('AuthManager', function AuthManager() {
  var securities = new Map();

  this.basicAuth = function (security, options) {
    if (angular.isObject(options) && options.username && options.password) {
      options.isAuthenticated = true;
      options.base64 = 'TODO';
      securities.set(security, options);
    } else {
      throw new Error('Can not authenticate with options');
    }
  };

  this.getAuth = function (security) {
    return securities.get(security);
  };
});
