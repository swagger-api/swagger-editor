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
    }
  };
});
