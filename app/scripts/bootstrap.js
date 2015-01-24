'use strict';

$(function () {
  var embeddedDefaults = $('#embedded-defaults').text();

  // Try bootstrapping the app with embedded defaults if it exists
  try {
    embeddedDefaults = JSON.parse(embeddedDefaults);
    window.SwaggerEditor.$defaults = embeddedDefaults;
    angular.bootstrap(window.document, ['SwaggerEditor']);
    return;
  } catch (e) {}

  $.getJSON('/config/defaults.json').done(function (resp) {
    window.SwaggerEditor.$defaults = resp;
    angular.bootstrap(window.document, ['SwaggerEditor']);
  }).fail(function () {
    console.error('Failed to load defaults.json at', '/config/defaults.json');
  });
});
