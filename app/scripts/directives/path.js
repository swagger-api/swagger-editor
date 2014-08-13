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

      scope.getEditPath = function (pathName) {
        return '#/paths?path=' + window.encodeURIComponent(pathName);
      };

      // Initialize collapseList
      Object.keys(scope.path).forEach(function (operationName) {
        scope.collapseList[operationName] = true;
      });

      scope.toggleOperationListed = function ($event) {
        $event.stopPropagation();

        if(scope.pathIsListed()){
          scope.$parent.pathListedStatus[scope.pathName] = false;
          scope.setOperationsListed(true);
        } else {
          scope.setOperationsListed(!scope.operationsAreListed());
        }
      };

      scope.operationsAreListed = function () {
        return Object.keys(scope.collapseList).reduce(function (memory, operationName) {
          return scope.collapseList[operationName] && memory;
        }, true);
      };

      scope.setOperationsListed = function (value) {
        Object.keys(scope.collapseList).forEach(function (operationName) {
          scope.collapseList[operationName] = value;
        });
      };

      scope.pathIsListed = function (){
        return scope.$parent.isPathListed(scope.pathName);
      };

      scope.togglePathListed = function ($event) {
        $event.stopPropagation();
        scope.$parent.pathListedStatus[scope.pathName] =
          !scope.$parent.pathListedStatus[scope.pathName];
      };
    }
  };
});
