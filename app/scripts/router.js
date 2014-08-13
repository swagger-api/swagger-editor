'use strict';

PhonicsApp.config([
  '$compileProvider',
  '$stateProvider',
  '$urlRouterProvider',
  Router
]);

function Router($compileProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    views: {
      '': {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      },
      'header@home': {
        templateUrl: 'views/header/header.html',
        controller: 'HeaderCtrl'
      },
      'editor@home': { templateUrl: 'views/editor/editor.html' },
      'preview@home': { templateUrl: 'views/preview/preview.html' }
    }
  })
  .state('home.operation', {
    url: ':operationId',
    views: {
      'preview@home': {
        controller: 'PreviewCtrl',
        templateUrl: 'views/preview/preview.html'
      }
    }
  });


  $compileProvider.aHrefSanitizationWhitelist('.');
}
