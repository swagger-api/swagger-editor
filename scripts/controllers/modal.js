'use strict';

/*
 * General modal controller
*/
SwaggerEditor.controller('ModalCtrl', function ModalCtrl($scope,
  $uibModal) {
  $scope.cancel = $uibModal.close;
  $scope.close = $uibModal.close;
});
