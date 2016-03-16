'use strict';

SwaggerEditor.directive('swaggerOperation', function (defaults) {
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

      /*
       * Gets all available parameters
       *
       * @returns {array} - array of parameters
      */
      $scope.getParameters = function getParameters() {
        var hasPathParameter = _.isArray($scope.path.parameters);
        var hasOperationParameter = _.isArray($scope.operation.parameters);
        var operationParameters = $scope.operation.parameters;
        var pathParameters = $scope.path.parameters;

        // if there is no operation and path parameter return empty array
        if (!hasOperationParameter && !hasPathParameter) {
          return [];
        }

        // if there is no operation parameter return only path parameters
        if (!hasOperationParameter) {
          operationParameters = [];
        }

        // if there is no path parameter return operation parameters
        if (!hasPathParameter) {
          pathParameters = [];
        }

        // if there is both path and operation parameters return all of them
        return operationParameters.concat(pathParameters)
          .map(setParameterSchema);
      };

      /*
       * Sets the schema object for a parameter even if it doesn't have schema
       *
       * @param {object} parameter
       * @returns {object}
      */
      function setParameterSchema(parameter) {
        if (parameter.schema) {
          return parameter;

        } else if (parameter.type === 'array') {
          parameter.schema = _.pick(parameter, 'type', 'items');

        } else {
          var schema = {type: parameter.type};

          if (parameter.format) {
            schema.format = parameter.format;
          }

          parameter.schema = schema;
        }

        // if allowEmptyValue is explicitly set to false it means this parameter
        // is required for making a request.
        if (parameter.allowEmptyValue === false) {
          parameter.schema.required = true;
        }

        return parameter;
      }

      /*
       * Returns true if the operation responses has at least one response with
       * schema
       *
       * @param responses {object} - a hash of responses
       * @returns boolean
      */
      $scope.hasAResponseWithSchema = function (responses) {
        return _.keys(responses).some(function (responseCode) {
          return responses[responseCode] && responses[responseCode].schema;
        });
      };

      /*
       * Returns true if the operation responses has at least one response with
       * "headers" field
       *
       * @param responses {object} - a hash of responses
       * @returns boolean
      */
      $scope.hasAResponseWithHeaders = function (responses) {
        return _.keys(responses).some(function (responseCode) {
          return responses[responseCode] && responses[responseCode].headers;
        });
      };

      /*
       * Returns true if the operation responses has at least one response with
       * examples
       *
       * @param responses {object} - a hash of responses
       * @returns boolean
      */
      $scope.hasAResponseWithExamples = function (responses) {
        return _.keys(responses).some(function (responseCode) {
          return responses[responseCode] && responses[responseCode].examples;
        });
      };
    }
  };
});
