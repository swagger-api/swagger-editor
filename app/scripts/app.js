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
    $urlRouterProvider.otherwise('/main');

    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });

    $compileProvider.aHrefSanitizationWhitelist('blob:http');
  }]);
