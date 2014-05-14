'use strict';

PhonicsApp.directive('resource', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/resource.html',
    link: function(scope, element){
      scope.show = true;

      scope.collapseAll = function(){
        scope.show = true;
        $('.content', element).addClass('hidden');
      };

      scope.expandAll = function(){
        scope.show = true;
        $('.content', element).removeClass('hidden');
      };
    }
  };
});
