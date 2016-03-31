'use strict';

SwaggerEditor.directive('scrollIntoViewWhen', function() {
  return {
    restrict: 'A',
    link: function postLink($scope, $element, $attrs) {
      $scope.$watch($attrs.scrollIntoViewWhen, function(val) {
        if (val) {
          $element.scrollIntoView(100);
        }
      });
    }
  };
});
