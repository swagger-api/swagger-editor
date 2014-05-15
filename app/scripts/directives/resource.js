'use strict';

PhonicsApp.directive('resource', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/resource.html',
    link: function(scope, element){
      scope.collapsed = false;

      scope.collapseAll = function(){
        scope.collapsed = false;
        $('.content', element).addClass('collapsed');
      };

      scope.expandAll = function(){
        scope.collapsed = false;
        $('.content', element).removeClass('collapsed');
      };
    }
  };
});
