'use strict';

PhonicsApp.directive('resource', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/resource.html'
  };
});
