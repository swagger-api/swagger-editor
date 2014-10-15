'use strict';

PhonicsApp.config(function Router($compileProvider, $stateProvider,
  $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/{mode}?import',
    views: {
      '': {
        templateUrl: function ($statePrams) {
          if ($statePrams.mode === 'edit') {
            return 'views/main.html';
          } else {
            return 'views/main-preview.html';
          }
        },
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
});
