'use strict';

SwaggerEditor.controller('PreferencesCtrl', function PreferencesCtrl($scope,
  $modalInstance, Preferences) {

  $scope.keyPressDebounceTime = Preferences.get('keyPressDebounceTime');
  $scope.liveRender = Preferences.get('liveRender');

  $scope.save = function () {
    var value = parseInt($scope.keyPressDebounceTime, 10);
    if (value > 0) {
      Preferences.set('keyPressDebounceTime', value);
    } else {
      throw new Error('$scope.keyPressDebounceTime was not set correctly');
    }

    Preferences.set('liveRender', $scope.liveRender);

    $modalInstance.close();
  };

  $scope.close = $modalInstance.close;
});
