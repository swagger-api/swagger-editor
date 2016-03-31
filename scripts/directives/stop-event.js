'use strict';

// From http://stackoverflow.com/a/19846473/650722
SwaggerEditor.directive('stopEvent', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('click', function(e) {
        e.stopPropagation();
      });
    }
  };
});
