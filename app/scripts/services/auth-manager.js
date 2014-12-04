'use strict';

/*
 * Manages Authentications
*/
PhonicsApp.service('AuthManager', function AuthManager() {
  var securities = {};

  this.basicAuth = function (securityName, security, options) {
    if (angular.isObject(options) && options.username && options.password) {
      options.isAuthenticated = true;
      options.base64 = window.btoa(options.username + ':' + options.password);
      options.securityName = securityName;
      securities[securityName] = {
        type: 'basic',
        security: security,
        options: options
      };
    } else {
      throw new Error('Can not authenticate with options');
    }
  };

  this.getAuth = function (securityName) {
    return securities[securityName];
  };

  this.securityIsAuthenticated = function (securityName) {
    var auth = securities[securityName];

    return auth && auth.options && auth.options.isAuthenticated;
  };
});
