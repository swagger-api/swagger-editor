'use strict';

PhonicsApp.directive('path', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/path.html',
    scope: {
      path: '=',
      pathName: '='
    },
    link: function (scope) {
      scope.toggleListed = function () {
        if(scope.pathIsHidden){
          scope.pathIsHidden = false;
          scope.pathIsListed = true;
        } else {
          scope.pathIsListed = !scope.pathIsListed;
        }
      };
    }
  };
});
