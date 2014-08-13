'use strict';

PhonicsApp.controller('ErrorPresenterCtrl', ['$scope', function ($scope) {

  $scope.getError = function (){
    return $scope.$parent.error;
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
