'use strict';

PhonicsApp.directive('operation', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/operation.html',
    link: function(scope){
      scope.collapsed = false;
      scope.getSigniture = function(parameter){
        return parameter.type;
      };
    }
  };
});
