'use strict';

PhonicsApp.directive('signature', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/templates/signature.html'
  };
});
