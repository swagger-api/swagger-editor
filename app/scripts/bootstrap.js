'use strict';

$(function () {

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
    $.getJSON(url).done(bootstrap).fail(function (error) {
      console.error('Failed to load defaults.json from', url);
      console.error(error);
    });
  }

  function bootstrap(defaults) {

    // if host is not localhost it's production
    var isProduction = !/localhost/.test(window.location.host);

    window.SwaggerEditor.$defaults = defaults;

    angular.bootstrap(window.document, ['SwaggerEditor'], {
      strictDi: isProduction
    });
  }
});
