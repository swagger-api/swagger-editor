'use strict';

SwaggerEditor.controller('PreferencesCtrl', function PreferencesCtrl($scope,
  $uibModalInstance, Preferences) {
  $scope.keyPressDebounceTime = Preferences.get('keyPressDebounceTime');
  $scope.liveRender = Preferences.get('liveRender');
  $scope.autoComplete = Preferences.get('autoComplete');

  $scope.save = function() {
    var value = parseInt($scope.keyPressDebounceTime, 10);
    if (value > 0) {
      Preferences.set('keyPressDebounceTime', value);
    } else {
      throw new Error('$scope.keyPressDebounceTime was not set correctly');
    }

    Preferences.set('liveRender', $scope.liveRender);
    Preferences.set('autoComplete', $scope.autoComplete);

    $uibModalInstance.close();
  };

  $scope.close = $uibModalInstance.close;
});
