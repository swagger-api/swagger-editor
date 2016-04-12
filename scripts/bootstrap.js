'use strict';

var angular = require('angular');
var $ = require('jquery');
var _ = require('lodash/string');

$(function() {
  // Try bootstrapping the app with embedded defaults if it exists
  var embeddedDefaults = window.$$embeddedDefaults;
  var pathname = window.location.pathname;

  if (!_.endsWith(pathname, '/')) {
    pathname += '/';
  }

  var url = pathname + 'config/defaults.json';

  if (embeddedDefaults) {
    bootstrap(embeddedDefaults);
  } else {
    $.getJSON(url).done(bootstrap).fail(function(error) {
      console.error('Failed to load defaults.json from', url);
      console.error(error);
    });
  }

  /**
   * Bootstrap the application
   * @param {object} defaults - The defaults object
   * @return {undefined}
  */
  function bootstrap(defaults) {
    window.SwaggerEditor.$defaults = defaults;

    angular.bootstrap(window.document, ['SwaggerEditor']);
  }
});
