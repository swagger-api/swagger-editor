'use strict';

/*
 * General modal controller
*/
SwaggerEditor.controller('ModalCtrl', function ModalCtrl($scope,
  $uibModalInstance) {
  $scope.cancel = $uibModalInstance.close;
  $scope.close = $uibModalInstance.close;
});
