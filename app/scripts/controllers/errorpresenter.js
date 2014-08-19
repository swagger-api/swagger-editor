'use strict';

PhonicsApp.controller('ErrorPresenterCtrl', ['$scope', function ($scope) {

  $scope.getError = function () {
    var error = $scope.$parent.error;

    if (error && error.swaggerError) {
      delete error.swaggerError.stack;
    }

    return error;
  };

  $scope.getType = function () {
    var error = $scope.getError();

    if (error.swaggerError) {
      return 'Swagger Error';
    }

    if (error.yamlError) {
      return 'YAML Syntax Error';
    }

    if (error.resolveError) {
      return 'Resolve Error';
    }

    return 'Unknown Error';
  };

  $scope.getDescription = function () {
    var error = $scope.getError();

    if (error.swaggerError && typeof error.swaggerError.dataPath === 'string') {

      // TODO: find a badass regex that can handle ' ▹ ' case without two replaces
      return error.swaggerError.message +
        ' at\n' + error.swaggerError.dataPath.replace(/\//g, ' ▹ ')
        .replace(' ▹ ', '').replace(/~1/g, '/');
    }

    if (error.yamlError) {
      return error.yamlError.message.replace('JS-YAML: ', '').replace(/./, function (a) {
        return a.toUpperCase();
      });
    }

    if (error.resolveError) {
      return error.resolveError.message.replace(/ in \{.+/, '');
    }

    return error;
  };
}]);
