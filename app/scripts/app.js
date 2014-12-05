'use strict';

window.PhonicsApp = angular.module('PhonicsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.ace',
  'ui.bootstrap',
  'ngStorage',
  'ngSanitize',
  'jsonFormatter',
  'hc.marked',
  'ui.layout',
  'mohsen1.json-schema-view',
  'schemaForm'
]);

$(function () {
  $.getJSON('/config/defaults.json').done(function (resp) {
    window.$$$defaults$$$ = resp;
    angular.bootstrap(window.document, ['PhonicsApp']);
  }).fail(function () {
    console.error('Failed to load defaults.json at', '/config/defaults.json');
  });
});
