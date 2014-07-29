'use strict';

PhonicsApp
  .directive('schemaModel', function () {
    return {
      templateUrl: 'templates/schema-model.html',
      restrict: 'E',
      replace: true,
      scope: {
        schema: '='
      },
      link: function postLink(scope) {
        scope.mode = 'table';
      }
    };
  });
