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
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      })
      .state('main.header', {
        templateUrl: 'views/header/header.html'
      })
      .state('main.editor', {
        templateUrl: 'views/editor/editor.html'
      });


    $compileProvider.aHrefSanitizationWhitelist('blob:http');
  }]);
