'use strict';

SwaggerEditor.directive('swaggerEditorXVendorParameter', function(defaults) {
  return {
    restrict: 'E',
    template: require('templates/x-vendor-parameter.html'),
    scope: {
      parameter: '='
    }
  };
});
