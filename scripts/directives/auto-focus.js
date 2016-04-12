'use strict';

// From https://gist.github.com/mlynch/dd407b93ed288d499778
SwaggerEditor.directive('autoFocus', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      $timeout(function() {
        $element[0].focus();
      }, $attributes.autoFocus || 1);
    }
  };
});
