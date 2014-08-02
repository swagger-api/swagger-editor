'use strict';

PhonicsApp.directive('splitView', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    scope: {
      json: '='
    },
    link: function postLink(scope, element, attrs) {

    }
  };
});
