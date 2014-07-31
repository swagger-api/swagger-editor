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
      scope.paramModels = {
        // '__content_type__': scope.getContentTypeHeaders()[0]
      };
      scope.hasBody = scope.$parent.operation.parameters.some(function (parameter) {
        return parameter.in === 'body';
      });
      scope.generateUrl = generateUrl;
      scope.makeCall = makeCall;
      scope.getContentTypeHeaders = getContentTypeHeaders;


      function getContentTypeHeaders() {
        if (scope.$parent.operation.consumes) {
          return scope.$parent.operation.consumes;
        } else {
          return scope.$parent.$parent.$parent.$parent.consumes;
        }
      }

      function generateUrl () {

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
          if (parameter.in === 'query' && scope.paramModels[parameter.name]) {
            queryParams[parameter.name] = scope.paramModels[parameter.name];
          }
          return queryParams;
        }, {});
        var queryParamsStr = $.param(queryParams);


        return host + pathTemplate(pathParams) + (queryParamsStr ? '?' + queryParamsStr : '');
      }

      function makeCall() {
        window.alert('TODO');
      }
    }
  };
});
