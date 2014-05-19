'use strict';

window.PhonicsApp = angular.module('PhonicsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.ace',
  'ngStorage'
]);

PhonicsApp.config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/:resource/:id', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $compileProvider.aHrefSanitizationWhitelist('blob:http');
  }]);
