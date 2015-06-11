'use strict';

SwaggerEditor.controller('PreferencesCtrl', function PreferencesCtrl($scope,
  $modalInstance, Preferences) {

  $scope.keyPressDebounceTime = Preferences.get('keyPressDebounceTime');

  $scope.save = function () {
    var value = parseInt($scope.keyPressDebounceTime, 10);
    if (value > 0) {
      Preferences.set('keyPressDebounceTime', value);
    } else {
      throw new Error('$scope.keyPressDebounceTime was not set correctly');
    }
    $modalInstance.close();
  };
});
