'use strict';

PhonicsApp.directive('operation', [function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    link: function(scope){
      scope.responseCodeClassFor = function (code) {
        var result = 'default';
        switch(Math.floor(+code / 100)){
          case 2:
            result = 'green';
            break;
          case 5:
            result = 'red';
            break;
          case 4:
            result = 'yellow';
            break;
          case 3:
            result = 'blue';
        }
        return result;
      };

      scope.toggleCollapsed = function () {
        scope.collapsed = !scope.collapsed;
      };

      scope.showTryOperation = function () {
        scope.tryIsOpen = !scope.tryIsOpen;
      };
    }
  };
}]);
