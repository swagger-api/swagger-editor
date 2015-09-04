'use strict';

SwaggerEditor.directive('schemaModel', function ($parse) {

  /*
  ** Removes vendor extensions (x- keys) deeply from an object
  */
  function removeVendorExtensions(obj) {
    if (!angular.isObject(obj) || angular.isArray(obj)) {
      return obj;
    }

    var result = {};

    Object.keys(obj).forEach(function (k) {
      if (k.toLowerCase().substring(0, 2) !== 'x-') {
        result[k] = removeVendorExtensions(obj[k]);
      }
    });

    return result;
  }

  return {
    templateUrl: 'templates/schema-model.html',
    restrict: 'E',
    replace: true,
    scope: {
      schema: '&'
    },

    link: function postLink($scope, $element, $attributes) {
      $scope.mode = 'schema';

      $scope.switchMode = function () {
        $scope.mode = $scope.mode === 'json' ? 'schema' : 'json';
        render();
      };

      $scope.json = removeVendorExtensions(
        $parse($attributes.schema)($scope.$parent)
      );

      render();

      function render() {
        if ($scope.mode === 'json') {
          window.requestAnimationFrame(function () {
            var formatter = new JSONFormatter($scope.json);
            var html = formatter.render();
            $element.find('td.view').html(html);
          });
        } else {
          window.requestAnimationFrame(function () {
            var schemaView = new JSONSchemaView($scope.json);
            var html = schemaView.render();
            $element.find('td.view').html(html);
          });
        }
      }
    }
  };
});
