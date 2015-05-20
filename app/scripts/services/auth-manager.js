'use strict';

/*
 * Manages Authentications
*/
SwaggerEditor.service('AuthManager', function AuthManager($sessionStorage) {
  $sessionStorage.$default({securities: {}, securityKeys: {}});
  var securities = $sessionStorage.securities;
  var securityKeys = $sessionStorage.securityKeys;

  /*
   * Authenticates HTTP Basic Auth securities
   * @param securityName {string} - name of the security
   * @param security {object} - the security object
   * @param options {object} - options of the security including authentication
   * details
  */
  this.basicAuth = function (securityName, security, options) {
    if (securityName === '$$hashKey') {
      return;
    }
    if (angular.isObject(options)) {

      options.username = options.username || '';
      options.password = options.password || '';
      options.isAuthenticated = true;
      options.base64 = window.btoa(options.username + ':' + options.password);
      options.securityName = securityName;
      var key = securityKeys[securityName];
      securities[key] = {
        type: 'basic',
        security: security,
        options: options
      };
    } else {
      throw new Error('Can not authenticate with options');
    }
  };

  /*
   * Authenticates OAuth2 securities
   * @param securityName {string} - name of the security
   * @param security {object} - the security object
   * @param options {object} - options of the security including authentication
   * details
  */
  this.oAuth2 = function (securityName, security, options) {
    if (securityName === '$$hashKey') {
      return;
    }
    options.isAuthenticated = true;
    var key = securityKeys[securityName];
    securities[key] = {
      type: 'oAuth2',
      security: security,
      options: options
    };
  };

  /*
   * Authenticates API Key securities
   * @param securityName {string} - name of the security
   * @param security {object} - the security object
   * @param options {object} - options of the security including authentication
   * details
  */
  this.apiKey = function (securityName, security, options) {
    if (securityName === '$$hashKey') {
      return;
    }
    options.isAuthenticated = true;
    var key = securityKeys[securityName];
    securities[key] = {
      type: 'apiKey',
      security: security,
      options: options
    };
  };

  /*
   * Gets a security object
   * @returns {object} the security object
  */
  this.getAuth = function (securityName) {
    var key = securityKeys[securityName];
    if (key) {
      return securities[key];
    } else {
      return {};
    }
  };

  /*
   * Checks if a security is authenticated
   * @returns {boolean} - true if security is authenticated false otherwise
  */
  this.securityIsAuthenticated = function (securityName) {
    var auth = {};
    var key = securityKeys[securityName];
    if (key) {
      auth = securities[key];
    }

    return auth && auth.options && auth.options.isAuthenticated;
  };
});
