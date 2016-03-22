'use strict';

SwaggerEditor.controller('GeneralModal', function GeneralModal($scope,
  $uibModalInstance, data) {
  $scope.ok = $uibModalInstance.close;
  $scope.cancel = $uibModalInstance.close;
  $scope.data = data;
});
