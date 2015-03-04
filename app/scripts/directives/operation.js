'use strict';

SwaggerEditor.directive('operation', function (defaults) {
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

      $scope.getParameters = function () {
        if (!Array.isArray($scope.operation.parameters)) {
          return $scope.path.pathParameters;
        }

        if (!Array.isArray($scope.path.pathParameters)) {
          return $scope.operation.parameters;
        }

        return $scope.operation.parameters.concat($scope.path.pathParameters);
      };

      $scope.getParameterSchema = function (parameter) {
        if (parameter.schema) {
          return parameter.schema;
        }

        if (parameter.type === 'array') {
          return _.pick(parameter, 'type', 'items');
        }

        return {type: parameter.type};
      };

      /*
       * Returns true if the operation responses has at least one response with
       * schema
       *
       * @param responses {array} - an array of responses
       * @returns boolean
      */
      $scope.hasAResponseWithSchema = function (responses) {
        return responses.some(function (response) {
          return response.schema;
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
        return responses.some(function (response) {
          return response.headers;
        });
      };
    }
  };
});
