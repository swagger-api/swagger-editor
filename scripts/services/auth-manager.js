'use strict';

var _ = require('lodash');

/*
 * Manages Authentications
*/
SwaggerEditor.service('AuthManager', function AuthManager($sessionStorage) {
  $sessionStorage.$default({
    securities: {}
  });

  /*
   * Authenticates HTTP Basic Auth securities
   * @param securityName {string} - name of the security
   * @param security {object} - the security object
   * @param options {object} - options of the security including authentication
   * details
  */
  this.basicAuth = function(securityName, security, options) {
    if (securityName === '$$hashKey') {
      return;
    }
    if (!_.isObject(options)) {
      throw new TypeError('Can not authenticate with options');
    }

    options.username = options.username || '';
    options.password = options.password || '';
    options.isAuthenticated = true;
    options.base64 = window.btoa(options.username + ':' + options.password);
    options.securityName = securityName;
    $sessionStorage.securities[securityName] = {
      type: 'basic',
      security: security,
      options: options
    };
  };

  /*
   * Authenticates OAuth2 securities
   * @param securityName {string} - name of the security
   * @param security {object} - the security object
   * @param options {object} - options of the security including authentication
   * details
  */
  this.oAuth2 = function(securityName, security, options) {
    if (securityName === '$$hashKey') {
      return;
    }
    options.isAuthenticated = true;
    $sessionStorage.securities[securityName] = {
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
  this.apiKey = function(securityName, security, options) {
    if (securityName === '$$hashKey') {
      return;
    }
    options.isAuthenticated = true;
    $sessionStorage.securities[securityName] = {
      type: 'apiKey',
      security: security,
      options: options
    };
  };

  /*
   * Gets a security object
   * @returns {object} the security object
  */
  this.getAuth = function(securityName) {
    return $sessionStorage.securities[securityName];
  };

  /*
   * Checks if a security is authenticated
   * @returns {boolean} - true if security is authenticated false otherwise
  */
  this.securityIsAuthenticated = function(securityName) {
    var auth = $sessionStorage.securities[securityName];

    return auth && auth.options && auth.options.isAuthenticated;
  };
});
