'use strict';

PhonicsApp.directive('scrollIntoViewWhen', function () {
  // var TRANSITION_DURATION = 200; //ms

  return {
    restrict: 'A',
    link: function postLink($scope, $element, $attrs) {

      $scope.$watch($attrs.scrollIntoViewWhen, function (val) {
        if (val) {
          $('.preview.pane').animate({
            scrollTop: $element
          }, 1000);
        }
      });
    }
  };
});
