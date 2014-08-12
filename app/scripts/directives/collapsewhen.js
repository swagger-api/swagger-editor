'use strict';

PhonicsApp.directive('collapseWhen', function () {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      var heightBuffer = null;

      // Put height in style attribute with a delay because
      // some elements take larger spaces when they have
      // angular bindings.
      // TODO: It's a hack, find a better way to wait for
      // other angular $digest to finish
      setTimeout(function (){
        element.height(element.height());
      }, 400);

      scope.$watch(attrs.collapseWhen, function (val) {
        if (val) {
          heightBuffer = element.height();
          element.height(0);
        } else {
          element.height(heightBuffer);
        }
      });
    }
  };
});
