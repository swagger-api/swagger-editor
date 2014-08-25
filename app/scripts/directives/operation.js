'use strict';

PhonicsApp.directive('operation', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    scope: false
  };
}]);
