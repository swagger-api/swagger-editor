'use strict';

$(function () {
  $.getJSON('/config/defaults.json').done(function (resp) {
    window.SwaggerEditor.$defaults = resp;
    angular.bootstrap(window.document, ['SwaggerEditor']);
  }).fail(function () {
    console.error('Failed to load defaults.json at', '/config/defaults.json');
  });
});
