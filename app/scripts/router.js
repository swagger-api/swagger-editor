'use strict';

PhonicsApp.config(function Router($compileProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '',
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
  })
    .state('home.path', {
      url: '/paths?path',
      views: {
        header: {
          templateUrl: 'views/header/header.html',
          controller: 'HeaderCtrl'
        },
        editor: {
          templateUrl: 'views/editor/editor.html',
          controller: 'EditorCtrl'
        },
        preview: {
          templateUrl: 'views/preview/preview.html',
          controller: 'PreviewCtrl'
        }
      }
    });
      // .state('home.path.operation', {
      //   url: ':operationId',
      //   views: {
      //     'preview@home.path.operation': {
      //       controller: 'PreviewCtrl',
      //       templateUrl: 'views/preview/preview.html'
      //     }
      //   }
      // });

  $compileProvider.aHrefSanitizationWhitelist('.');
});
