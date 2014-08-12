'use strict';

PhonicsApp.controller('ErrorPresenterCtrl', function ($scope) {

  $scope.getError = function (){
    return  $scope.$parent.specs && $scope.$parent.specs.error;
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
      return error.message;
    }


    return error;
  };
});
