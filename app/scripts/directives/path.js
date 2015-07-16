'use strict';

SwaggerEditor.directive('swaggerPath', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/path.html',
    scope: false
  };
});
