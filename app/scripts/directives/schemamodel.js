'use strict';

function stringifySchema (schema) {
  var str = '';
  if (schema.type && schema.type === 'array') {
    str = '[' + stringifySchema(schema.items) + ']';
  } else {
    str = '"' + schema.type + '"';
  }
  if (schema.format) {
    str += '(' + schema.format + ')';
  }

  return str;
}

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
        scope.mode = 'model';

        scope.getJson = function () {
          return JSON.stringify(scope.schema, null, 2);
        };

        scope.getString = function () {
          return stringifySchema(scope.schema);
        };
      }
    };
  });
