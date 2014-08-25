'use strict';

PhonicsApp.directive('path', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/path.html',
    scope: {
      path: '=',
      pathName: '=',
      isSingle: '='
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
        scope.collapseList[operationName] = !scope.isSingle;
      });
    }
  };
});
