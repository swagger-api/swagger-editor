'use strict';

SwaggerEditor.directive('path', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/path.html',
    scope: false
  };
});
