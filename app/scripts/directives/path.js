'use strict';

function setOperationsCollapsed(scope, isCollapsed){
  scope.listed = isCollapsed;
  scope.path.apis.forEach(function(api){
    api.operations.forEach(function (operation){
      operation.collapsed = isCollapsed;
    });
  });
}

PhonicsApp.directive('path', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/path.html',
    scope: { path: '=' },
    link: function(scope){
      scope.collapsed = false;
      scope.collapseAll = function(){
        scope.collapsed = false;
        setOperationsCollapsed(scope, true);
      };

      scope.expandAll = function(){
        scope.collapsed = false;
        setOperationsCollapsed(scope, false);
      };
    }
  };
});
