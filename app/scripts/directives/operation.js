'use strict';

PhonicsApp.directive('operation', function (defaults) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    scope: false,
    link: function ($scope) {
      $scope.isTryOpen = false;
      $scope.enableTryIt = defaults.enableTryIt;
      $scope.toggleTry = function toggleTry() {
        $scope.isTryOpen = !$scope.isTryOpen;
      };
    }
  };
});
