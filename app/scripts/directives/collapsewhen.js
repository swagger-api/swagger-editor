'use strict';

SwaggerEditor.directive('collapseWhen', function () {
  // Animation styles needed for Safari browser and removed from CSS class
  var transitionCss = {
    'transition-property': 'height',
    'transition-duration': '200ms',
    'transition-timing-function': 'ease-out'
  };

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      var buffer = 0;
      // This implementation is used to fix transition animation of Height with
      // auto value for the Safari browser.
      // The Safari's transition animation differs from other browsers.
      // 'Auto' isn't an appropriate type for an animatable property, see CSS Transitions: 7. Animatable properties.
      // Thus a CSS only solution isn't possible, as long as auto isn't added to the list.
      // We need to use JavaScript or a specific length value.
      scope.$watch(attrs.collapseWhen, function (val) {
        if (val) {
          // Collapse block
          buffer = element.height();
          element.height(buffer);
          element.css(transitionCss);
          element.height(0);
        } else {
          // Expand block
          if (buffer != 0) { // This check is needed to show all elements during page initiation (for Chrome and FF)
            var prevHeight = element.height();
            element.height('auto');
            var endHeight = element.height();
            element.height(prevHeight);
            element.css(transitionCss);
            element.height(endHeight);
            // Set 'auto' hight after transition to make a block adaptive
            element.on('transitionend', function transitionEnd(e) {
              buffer = element.height();
              element.css('transition', '');
              element.height('auto');
              element.off('transitionend', transitionEnd);
            });
          }
        }
      });
    }
  };
});
