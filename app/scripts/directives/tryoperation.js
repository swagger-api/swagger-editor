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
        var path = scope.$parent.$parent.pathName;
        var pathTemplate = _.template(path);
        var pathParams = scope.$parent.operation.parameters.reduce(function (pathParams, parameter) {
          if (parameter.in === 'path') {
            pathParams[parameter.name] = scope.paramModels[parameter.name];
          }
          return pathParams;
        }, {});
        var queryParams =  scope.$parent.operation.parameters.reduce(function (queryParams, parameter) {
          if (parameter.in === 'query') {
            queryParams[parameter.name] = scope.paramModels[parameter.name];
          }
          return queryParams;
        }, {});


        return host + pathTemplate(pathParams) + $.param(queryParams);
      };

      scope.makeCall = function () {
        window.alert('TODO');
      };
    }
  };
});
