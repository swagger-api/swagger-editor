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

      // collapseList stores the state of collapsed/not-collapsed of each operation
      // in path level so we can manipulate them from path level
      scope.collapseList =  Object.create(null);

      // Initialize collapseList
      Object.keys(scope.path).forEach(function (operationName) {
        scope.collapseList[operationName] = false;
      });

      scope.toggleListed = function () {
        if(scope.pathIsHidden){
          scope.pathIsHidden = false;
          scope.setPathIsListed(true);
        } else {
          scope.setPathIsListed(!scope.pathIsListed());
        }
      };

      scope.pathIsListed = function () {
        return Object.keys(scope.collapseList).reduce(function (memory, operationName) {
          return scope.collapseList[operationName] && memory;
        }, true);
      };

      scope.setPathIsListed = function (value) {
        Object.keys(scope.collapseList).forEach(function (operationName) {
          scope.collapseList[operationName] = value;
        });
      };
    }
  };
});
