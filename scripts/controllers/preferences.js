'use strict';

SwaggerEditor.controller('PreferencesCtrl', function PreferencesCtrl($scope,
  $uibModalInstance, Preferences) {
  $scope.keyPressDebounceTime = Preferences.get('keyPressDebounceTime');
  $scope.liveRender = Preferences.get('liveRender');
  $scope.autoComplete = Preferences.get('autoComplete');
  $scope.pointerResolutionBasePath =
    Preferences.get('pointerResolutionBasePath');

  $scope.save = function() {
    var keyPressDebounceTime = parseInt($scope.keyPressDebounceTime, 10);
    if (keyPressDebounceTime > 0) {
      Preferences.set('keyPressDebounceTime', keyPressDebounceTime);
    } else {
      throw new Error('$scope.keyPressDebounceTime was not set correctly');
    }

    Preferences.set('liveRender', $scope.liveRender);
    Preferences.set('autoComplete', $scope.autoComplete);
    Preferences.set('pointerResolutionBasePath',
      $scope.pointerResolutionBasePath);

    $uibModalInstance.close();
  };

  $scope.close = $uibModalInstance.close;
});
