'use strict';

SwaggerEditor.controller('ConfirmReset', function ConfirmReset($scope,
  $uibModalInstance, Editor) {
  $scope.cancel = $uibModalInstance.close;
  $scope.ok = function() {
    Editor.resetSettings();
    $uibModalInstance.close();
  };
});
