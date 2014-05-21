'use strict';

PhonicsApp.directive('dropdownMenu', function () {
  return {
    templateUrl: 'templates/dropdown-menu.html',
    restrict: 'E',
    transclude: true,
    scope: {
      label: '@',
      onOpen: '='
    }
  };
});
