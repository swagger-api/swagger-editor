'use strict';

/*
 * General modal controller
*/
SwaggerEditor.controller('ModalCtrl', function ModalCtrl($scope,
  $uibModalInstancee) {
  $scope.cancel = $uibModalInstancee.close;
  $scope.close = $uibModalInstancee.close;
});
