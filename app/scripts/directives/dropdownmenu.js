'use strict';

PhonicsApp.directive('dropdownMenu', function () {
  return {
    templateUrl: 'templates/dropdown-menu.html',
    restrict: 'E',
    transclude: true,
    scope: {
      label: '@',
      onOpen: '='
    },
    link: function postLink(scope) {
      scope.open = false;
      scope.toggle = function(){
        scope.open = !scope.open;
        if(scope.open && typeof scope.onOpen === 'function'){
          scope.onOpen();
        }
      };
    }
  };
});
