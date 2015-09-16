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
      $scope.getParameters = function () {
        var hasPathParameter = Array.isArray($scope.path.parameters);
        var hasOperationParameter = Array.isArray($scope.operation.parameters);

        // if there is no operation and path parameter return empty array
        if (!hasOperationParameter && !hasPathParameter) {
          return [];
        }

        // if there is no operation parameter return only path parameters
        if (!hasOperationParameter) {
          return $scope.path.parameters || [];
        }

        // if there is no path parameter return operation parameters
        if (!hasPathParameter) {
          return $scope.operation.parameters || [];
        }

        // if there is both path and operation parameters return all of them
        return $scope.operation.parameters
          .concat($scope.path.parameters)
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

        return parameter;
      }

      /*
       * Returns true if the operation responses has at least one response with
       * schema
       *
       * @param responses {array} - an array of responses
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
       * @param responses {array} - an array of responses
       * @returns boolean
      */
      $scope.hasAResponseWithHeaders = function (responses) {
        return _.keys(responses).some(function (responseCode) {
          return responses[responseCode] && responses[responseCode].headers;
        });
      };
    }
  };
});
