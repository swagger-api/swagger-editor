'use strict';

var angular = require('angular');

SwaggerEditor.config(function Router($compileProvider, $stateProvider,
  $urlRouterProvider, $logProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/?import&tags&no-proxy',
    views: {
      '': {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      },
      'header@home': {
        templateUrl: 'views/header/header.html',
        controller: 'HeaderCtrl'
      },
      'editor@home': {
        templateUrl: 'views/editor/editor.html',
        controller: 'EditorCtrl'
      },
      'preview@home': {
        templateUrl: 'views/preview/preview.html',
        controller: 'PreviewCtrl'
      }
    }
  });

  var $cookies = angular.injector([require('angular-cookies')]).get('$cookies');
  var isDevelopment = Boolean($cookies.get('swagger-editor-development-mode'));

  $compileProvider.aHrefSanitizationWhitelist('.');

  $compileProvider.debugInfoEnabled(isDevelopment);
  $logProvider.debugEnabled(isDevelopment);
});
