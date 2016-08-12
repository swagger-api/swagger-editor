'use strict';

SwaggerEditor.directive('swaggerEditorXVendorOperation', function(defaults) {
  return {
    restrict: 'E',
    template: require('templates/x-vendor-operation.html'),
    scope: {
      operation: '='
    }
  };
});
