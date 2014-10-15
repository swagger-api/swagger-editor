'use strict';

PhonicsApp.controller('GeneralModal', function GeneralModal($scope,
  $modalInstance, data) {
  $scope.ok = $modalInstance.close;
  $scope.cancel = $modalInstance.close;
  $scope.data = data;
});
