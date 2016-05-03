'use strict';

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

  $compileProvider.aHrefSanitizationWhitelist('.');

  $compileProvider.debugInfoEnabled(true);
  $logProvider.debugEnabled(true);
});
