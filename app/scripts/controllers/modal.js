'use strict';

/*
 * General modal controller
*/
PhonicsApp.controller('ModalCtrl', function ModalCtrl($scope, $modalInstance) {
  $scope.cancel = $modalInstance.close;
  $scope.close = $modalInstance.close;
});
