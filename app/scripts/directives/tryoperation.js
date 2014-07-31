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
      scope.httpProtorcol = 'HTTP/1.1';
      scope.paramModels = {};
      scope.hasBody = scope.$parent.operation.parameters.some(function (parameter) {
        return parameter.in === 'body';
      });

      scope.generateUrl = function  () {

        // FIXME: fix this insanity!
        var host = scope.$parent.$parent.$parent.$parent.host;

        return host + scope.$parent.$parent.pathName;
      };

      scope.makeCall = function () {
        window.alert('TODO');
      };
    }
  };
});
