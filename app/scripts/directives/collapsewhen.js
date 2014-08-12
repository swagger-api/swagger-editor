'use strict';

PhonicsApp.directive('collapseWhen', function () {
  var TRANSITION_DURATION = 200; //ms

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      var buffer = null;

      function cleanUp(){
        // remove style attribute after animation
        // TDOD: just remove 'height' from style
        setTimeout(function () {
          element.removeAttr('style');
        }, TRANSITION_DURATION);
      }

      // If it's collapsed initially
      if (!attrs.collapseWhen) {

      }

      scope.$watch(attrs.collapseWhen, function (val) {
        if (val) {
          buffer = element.height();
          element.height(buffer);
          element.height(0);
          element.addClass('c-w-collapsed');
          cleanUp();
        } else {
          element.height(buffer);
          element.removeClass('c-w-collapsed');
          cleanUp();
        }
      });
    }
  };
});
