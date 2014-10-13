'use strict';

PhonicsApp.directive('operation', function (FocusedPath) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    scope: false,
    link: function ($scope) {
      $scope.isTryOpen = false;
      $scope.toggleTry = function toggleTry() {
        $scope.isTryOpen = !$scope.isTryOpen;
      };

      /*
       * Returns true if operation is the operation in focus
       * in the editor
       * @returns {boolean}
      */
      $scope.isInFocus = function (path) {
        return FocusedPath.isInFocus(path);
      };
    }
  };
});
