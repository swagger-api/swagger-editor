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
      // FIXME: fix this insanity!
      var specs = scope.$parent.$parent.$parent.$parent.specs;

      scope.httpProtorcol = 'HTTP/1.1';
      scope.paramModels = {};
      scope.hasParams = Array.isArray(scope.$parent.operation.parameters);
      scope.hasBody = scope.hasParams && scope.$parent.operation.parameters
        .some(function (parameter) {
          return parameter.in === 'body';
        });
      scope.generateUrl = generateUrl;
      scope.makeCall = makeCall;
      scope.getContentTypeHeaders = getContentTypeHeaders;
      scope.xhrInProgress = false;
      scope.getHeaderParams = getHeaderParams;

      function getHeaderParams() {
        var headerParams = {};
        if (scope.hasParams) {
          scope.$parent.operation.parameters.filter(function (parameter) {
            if (parameter.in === 'header' &&
              scope.paramModels[parameter.name]) {
              headerParams[parameter.name] = scope.paramModels[parameter.name];
            }
          });
        }
        return headerParams;
      }

      function getContentTypeHeaders() {
        if (scope.$parent.operation.consumes) {
          return scope.$parent.operation.consumes;
        } else {
          return specs.consumes;
        }
      }

      function generateUrl() {
        var protocol = window.location.protocol;
        var host = specs.host || window.location.host;
        var basePath = specs.basePath || '';
        var path = scope.$parent.$parent.pathName;
        var pathTemplate = _.template(path);
        var params = scope.hasParams ? scope.$parent.operation.parameters : [];
        var pathParams = params.reduce(function (pathParams, parameter) {
          if (parameter.in === 'path') {
            pathParams[parameter.name] = scope.paramModels[parameter.name];
          }
          return pathParams;
        }, {});
        var queryParams =  params.reduce(function (queryParams, parameter) {
          if (parameter.in === 'query' && scope.paramModels[parameter.name]) {
            queryParams[parameter.name] = scope.paramModels[parameter.name];
          }
          return queryParams;
        }, {});
        var queryParamsStr = $.param(queryParams);

        return protocol + '//' + host + basePath + pathTemplate(pathParams) +
          (queryParamsStr ? '?' + queryParamsStr : '');
      }

      function makeCall() {
        scope.response = null;
        scope.xhrInProgress = true;
        scope.failed = false;

        $.ajax({
          url: scope.generateUrl(),
          type: scope.$parent.operationName,
          headers: _.extend({
            'Content-Type': scope.contentType
          }, getHeaderParams())
        })

        .fail(function () {
          scope.failed = true;
        })

        .always(function (resp) {
          if (!resp) {
            scope.responseText = '';
            scope.xhrInProgress = false;
            scope.$digest();
            return;
          }

          var text;
          try {
            text = JSON.stringify(
              JSON.parse(resp.responseText),
            null, 2);
          } catch (e) {
            text = resp.responseText;
          }
          if (angular.isString(text) && text.indexOf('<?xml') === 0) {
            scope.responseText = $('<div/>').text(text).html();
          } else {
            scope.responseText = text;
          }

          scope.response = resp;
          scope.xhrInProgress = false;
          scope.$digest();
        });
      }
    }
  };
});
