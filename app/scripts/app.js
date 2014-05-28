'use strict';

window.PhonicsApp = angular.module('PhonicsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.ace',
  'ngStorage'
]);

PhonicsApp.config([
  '$compileProvider',
  '$stateProvider',
  '$urlRouterProvider',
  function (
    $compileProvider,
    $stateProvider,
    $urlRouterProvider
  ) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        views: {
          '': {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          },
          'header@home': { templateUrl: 'views/header/header.html' },
          'editor@home': { templateUrl: 'views/editor/editor.html' },
          'preview@home': { templateUrl: 'views/preview/preview.html' }
        }
      });


    $compileProvider.aHrefSanitizationWhitelist('blob:http');
  }
]);
