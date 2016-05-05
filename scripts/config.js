'use strict';

var angular = require('angular');

SwaggerEditor.config(function Router($compileProvider, $logProvider,
  markedProvider) {
  var $cookies = angular.injector([require('angular-cookies')]).get('$cookies');
  var isDevelopment = Boolean($cookies.get('swagger-editor-development-mode'));

  $compileProvider.aHrefSanitizationWhitelist('.');

  $compileProvider.debugInfoEnabled(isDevelopment);
  $logProvider.debugEnabled(isDevelopment);

  markedProvider.setOptions({
    sanitize: true
  });
});
