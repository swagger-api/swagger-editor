'use strict';

SwaggerEditor.config(function Router($stateProvider,
  $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/?import&tags&no-proxy',
    views: {
      '': {
        template: require('views/main.html'),
        controller: 'MainCtrl'
      },
      'header@home': {
        template: require('views/header/header.html'),
        controller: 'HeaderCtrl'
      },
      'editor@home': {
        template: require('views/editor/editor.html'),
        controller: 'EditorCtrl'
      },
      'preview@home': {
        template: require('views/preview/preview.html'),
        controller: 'PreviewCtrl'
      }
    }
  });
});
