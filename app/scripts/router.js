'use strict';

SwaggerEditor.config(function Router($compileProvider, $stateProvider,
  $urlRouterProvider) {
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

  // Disable debug info in production. To detect the "production" mode we are
  // examining location.host to see if it matches localhost
  $compileProvider.debugInfoEnabled(/localhost/.test(window.location.host));
});
