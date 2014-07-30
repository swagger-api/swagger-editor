'use strict';

PhonicsApp.directive('tryOperation', function () {
  return {
    templateUrl: 'templates/try-operation.html',
    restrict: 'E',
    replace: true,
    scope: {
      operation: '='
    },
    link: function postLink(scope) {
      scope.getHost = function  () {
        // FIXME: fix this insanity!
        return scope.$parent.$parent.$parent.$parent.host;
      }
    }
  };
});
