'use strict';

PhonicsApp.controller('TryOperation', function ($scope, formdataFilter) {
  var specs = $scope.$parent.specs;

  $scope.httpProtorcol = 'HTTP/1.1';
  $scope.generateUrl = generateUrl;
  $scope.makeCall = makeCall;
  $scope.xhrInProgress = false;

  if (Array.isArray($scope.operation.parameters)) {
    $scope.parameters = $scope.operation.parameters.map(makeParam);
  }

  function makeParam(parameter) {
    var param = _.extend(parameter, {
      schema: schemaForParameter(parameter),
      form: formForParameter(parameter),
      model: {}
    });

    if (parameter.schema && parameter.schema.type === 'array') {
      param.model[parameter.name] = [];
    }

    return param;
  }

  function schemaForParameter(parameter) {
    var schema;

    // For rendering form we need "type" key
    if (parameter && parameter.schema) {
      if (!parameter.schema.type) {
        parameter.schema.type = 'object';
      }

      // Work around angular-schema-form issue handling array types
      if (parameter.schema.type === 'array') {
        schema = {
          type: 'object',
          properties: {}
        };

        schema.properties[parameter.name] = parameter.schema;
        schema.properties[parameter.name].type = 'array';

        // TODO: Is this always true?
        schema.properties[parameter.name].items.type = 'object';

        return schema;
      }
      return parameter.schema;
    }

    // If parameter do not have a schema use parameter itself as schema
    schema = {type: 'object', properties: {}};
    schema.properties[parameter.name] = _.pick(parameter,
      'type', 'description', 'required', 'format');
    return schema;
  }

  function formForParameter(parameter) {
    // Work around angular-schema-form issue handling array types
    if (parameter.schema && parameter.schema.type === 'array') {
      var form = [{key: parameter.name}];

      form[0].items = [parameter.name + '[]'];
      return form;
    }
    return ['*'];
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

  function generateUrl() {
    var scheme = $scope.scheme || 'http';
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

  $scope.hasBodyParam = function () {
    return $scope.parameters.some(function (param) {
      return param.in === 'body';
    });
  };

  $scope.getRequestBody = function () {

    var bodyModel = $scope.parameters.map(function (param) {
      if (param.in === 'body') {
        // part of horrible hack for json schema form
        if (Array.isArray(param.model[param.name])) {
          return param.model[param.name];
        }
        return param.model;
      }
    })[0];

    if ($scope.bodyFormat === 'form-data') {
      return formdataFilter(bodyModel);
    }
    else if ($scope.bodyFormat === 'json') {
      return JSON.stringify(bodyModel, null, 2);
    }

    return 'Not implemented!';
  };

  function makeCall() {
    $scope.xhrInProgress = true;
    $scope.error = null;

    $.ajax({
      url: $scope.generateUrl(),
      type: $scope.operation.operationName,
        // headers: _.extend({
        //   'Content-Type': $scope.contentType
        // }, getHeaderParams()),
      data: $scope.getRequestBody()
    })

    .fail(function (jqXHR, textStatus, errorThrown) {
      $scope.xhrInProgress = false;
      $scope.textStatus = textStatus;
      $scope.error = errorThrown;
      $scope.xhr = jqXHR;

      $scope.$digest();
    })

    .done(function (data, textStatus, jqXHR) {
      $scope.textStatus = textStatus;
      $scope.xhrInProgress = false;
      $scope.responseData = data;
      $scope.xhr = jqXHR;
      $scope.responseHeaders = getResponseHeaders(jqXHR);

      $scope.$digest();
    });
  }

  function parseHeaders(headers) {
    var result = {};

    headers.split('\n').forEach(function (line) {
      var key = line.split(':')[0];
      var value = line.split(':')[1];
      if (key && angular.isString(key) && angular.isString(value)) {
        result[key.trim()] = value.trim();
      }
    });

    return result;
  }

  function getResponseHeaders(xhr) {
    return parseHeaders(xhr.getAllResponseHeaders());
  }
});
