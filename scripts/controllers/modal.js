'use strict';

/*
 * General modal controller
*/
SwaggerEditor.controller('ModalCtrl', function ModalCtrl($scope,
  $modalInstance) {
  $scope.cancel = $modalInstance.close;
  $scope.close = $modalInstance.close;
});
