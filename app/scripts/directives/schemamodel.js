'use strict';

/*
** Removes vendor extensions (x- keys) deeply from an object
*/
function removeVendorExtensions(obj) {
  if (!angular.isObject(obj)) {
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

PhonicsApp
  .directive('schemaModel', function ($parse) {
    return {
      templateUrl: 'templates/schema-model.html',
      restrict: 'E',
      replace: true,
      scope: {
        schema: '='
      },
      link: function postLink($scope, $element, $attributes) {
        $scope.mode = 'model';
        $scope.json = removeVendorExtensions(
          $parse($attributes.schema)($scope.$parent)
        );
      }
    };
  });
