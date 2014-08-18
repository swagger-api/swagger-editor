'use strict';

function stringifySchema(schema) {
  if (!schema) {
    return '';
  }

  var str = '';

  if (schema.type) {

    // If it's an array, wrap it around []
    if (schema.type === 'array') {
      str = '[' + stringifySchema(schema.items) + ']';

    // Otherwise use schema type solely
    } else if (schema.type) {
      str = '"' + schema.type + '"';
    }
  }

  // If there is a format for this schema add append it
  if (schema.format) {
    str += '(' + schema.format + ')';

  // If this schema has properties and no format, build upon properties
  } else if (typeof schema.properties === 'object') {
    var propsStr = '';
    for (var property in schema.properties) {
      propsStr += '  ' + buildProperty(property, schema) + '\n';
    }
    str += propsStr;

  // If it's a custom model (object wrapping an schema with a single key)
  // unwrap it and pre-pend the key
  } else if (typeof schema === 'object' && Object.keys(schema).length === 1) {
    var key = Object.keys(schema)[0];

    // If this single keyed object just is 'type' it's not
    // custom model.
    if (key !== 'type') {
      str += key + ': {\n' +
        stringifySchema(schema[key]) +
        '}';
    }
  }

  return str;
}

function buildProperty(property, schema) {
  var result = property + ': ' +
    stringifySchema(schema.properties[property]);
  if (typeof schema.required === 'object' &&  schema.required.indexOf(property) > -1) {
    result += ' <required>';
  }
  return result;
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
          return scope.schema;
        };

        scope.getString = function () {
          return stringifySchema(scope.schema);
        };
      }
    };
  });
