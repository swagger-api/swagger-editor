'use strict';

PhonicsApp.directive('parameterView', function () {
  return {
    templateUrl: 'templates/parameter-view.html',
    restrict: 'E',
    replace: true,
    scope: { model: '=' }
  };
});
