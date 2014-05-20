'use strict';

function setOperationsCollapsed(scope, isCollapsed){
  scope.listed = isCollapsed;
  scope.resource.operationsArray.forEach(function (operation){
    operation.collapsed = isCollapsed;
  });
}

PhonicsApp.directive('resource', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/resource.html',
    scope: { resource: '=' },
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
