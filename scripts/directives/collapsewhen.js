'use strict';

SwaggerEditor.directive('collapseWhen', function() {
  var TRANSITION_DURATION = 200; // ms

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      var buffer = null;

      var cleanUp = function() {
        // remove style attribute after animation
        // TDOD: just remove 'height' from style
        setTimeout(function() {
          element.removeAttr('style');
        }, TRANSITION_DURATION);
      };

      // If it's collapsed initially
      if (attrs.collapseWhen) {
        var clone = element.clone();
        clone.removeAttr('style');
        clone.appendTo('body');
        buffer = clone.height();
        clone.remove();
      }

      scope.$watch(attrs.collapseWhen, function(val) {
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
