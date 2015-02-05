'use strict';

$(function () {

  // Try bootstrapping the app with embedded defaults if it exists
  var embeddedDefaults = window.$$embeddedDefaults;

  if (embeddedDefaults) {
    window.SwaggerEditor.$defaults = embeddedDefaults;
    angular.bootstrap(window.document, ['SwaggerEditor']);
  } else {
    var rootPath = '';
    if (window.location.pathname.lastIndexOf('/') !==
        (window.location.pathname.length - 1)) {
      rootPath = window.location.pathname + '/../';
    }
    $.getJSON(rootPath + './config/defaults.json').done(function (resp) {
      window.SwaggerEditor.$defaults = resp;
      angular.bootstrap(window.document, ['SwaggerEditor']);
    }).fail(function () {
      console.error('Failed to load defaults.json at',
        rootPath + './config/defaults.json');
    });
  }
});
