'use strict';

PhonicsApp.controller('ErrorPresenterCtrl', ['$scope', function ($scope) {

  $scope.getError = function (){
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

    return 'Unknown Error';
  };

  $scope.getDescription = function () {
    var error = $scope.getError();

    if (error.swaggerError) {
      return error.swaggerError.message +
      ' at ' + error.swaggerError.schemaPath;
    }


    return error;
  };
}]);
