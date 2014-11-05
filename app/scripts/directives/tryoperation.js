'use strict';

PhonicsApp.controller('TryOperation', function ($scope) {
  var specs = $scope.$parent.specs;

  $scope.httpProtorcol = 'HTTP/1.1';
  $scope.paramModels = {};
  $scope.hasParams = Array.isArray($scope.$parent.operation.parameters);
  $scope.hasBody = $scope.hasParams && $scope.$parent.operation.parameters
    .some(function (parameter) {
      return parameter.in === 'body';
    });
  $scope.generateUrl = generateUrl;
  $scope.makeCall = makeCall;
  $scope.getContentTypeHeaders = getContentTypeHeaders;
  $scope.xhrInProgress = false;
  $scope.getHeaderParams = getHeaderParams;

  if (Array.isArray($scope.operation.parameters)) {
    $scope.parameters = $scope.operation.parameters.map(function (parameter) {
      return _.extend(parameter, {
        schema: schemaForParameter(parameter),
        form: formForParameter(parameter),
        model: parameter.schema && parameter.schema.type === 'array' ?
          {item: []} : {}
      });
    });
  }

  function schemaForParameter(parameter) {

    // For rendering form we need "type" key
    if (parameter && parameter.schema) {
      if (!parameter.schema.type) {
        parameter.schema.type = 'object';
      }

      // Work around angular-schema-form issue handling array types
      if (parameter.schema.type === 'array') {
        return {
          type: 'object',
          properties: {
            item: parameter.schema
          }
        };
      }
      return parameter.schema;
    }

    // If parameter do not have a schema use parameter itself as schema
    var schema = {type: 'object', properties: {}};
    schema.properties[parameter.name] = _.pick(parameter,
      'type', 'description', 'required', 'format');
    return schema;
  }

  function formForParameter(parameter) {
    // Work around angular-schema-form issue handling array types
    if (parameter && parameter.type === 'array') {
      return [
        {
          key: 'item',
          items: ['*']
        }
      ];
    }
    return ['*'];
  }

  function getHeaderParams() {
    var headerParams = {};
    if ($scope.hasParams) {
      $scope.$parent.operation.parameters.filter(function (parameter) {
        if (parameter.in === 'header' &&
          $scope.paramModels[parameter.name]) {
          headerParams[parameter.name] = $scope.paramModels[parameter.name];
        }
      });
    }
    return headerParams;
  }

  function getContentTypeHeaders() {
    if ($scope.$parent.operation.consumes) {
      return $scope.$parent.operation.consumes;
    } else {
      return specs.consumes;
    }
  }

  function generateUrl() {
    var scheme = 'https';
    var host = specs.host || window.location.host;
    var basePath = specs.basePath || '';
    var pathTemplate = _.template($scope.path.pathName);
    var pathParams = $scope.parameters.reduce(filterParamsFor('path'), {});
    var queryParams = $scope.parameters.reduce(filterParamsFor('query'), {});
    var queryParamsStr = $.param(queryParams);
    var pathStr = '';

    try {
      pathStr = pathTemplate(pathParams);
    } catch (e) {}

    return scheme + '://' + host + basePath + pathStr +
      (queryParamsStr ? '?' + queryParamsStr : '');
  }

  function filterParamsFor(type) {
    return function filterParams(result, param) {
      if (param.in === type && param.model[param.name] &&
        param['default'] !== param.model[param.name]) {
        result[param.name] = param.model[param.name];
      }
      return result;
    };
  }

  $scope.getRequestBody = function () {
    return $scope.parameters.map(function (param) {
      if (param.in === 'body') {
        return param.model;
      }
    })[0];
  };

  function makeCall() {
    $scope.response = null;
    $scope.xhrInProgress = true;
    $scope.failed = false;

    $.ajax({
      url: $scope.generateUrl(),
      type: $scope.$parent.operationName,
      headers: _.extend({
        'Content-Type': $scope.contentType
      }, getHeaderParams())
    })

    .fail(function () {
      $scope.failed = true;
    })

    .always(function (resp) {
      if (!resp) {
        $scope.responseText = '';
        $scope.xhrInProgress = false;
        $scope.$digest();
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
        $scope.responseText = $('<div/>').text(text).html();
      } else {
        $scope.responseText = text;
      }

      $scope.response = resp;
      $scope.xhrInProgress = false;
      $scope.$digest();
    });
  }
});
