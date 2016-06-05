'use strict';

var _ = require('lodash');

SwaggerEditor.service('Resolve', function Resolve() {
/**
   * Resolves all of `allOf` recursively in a schema
   * @description
   * if a schema has allOf it means that the schema is the result of mergin all
   * schemas in it's allOf array.
   *
   * @param {object} schema - JSON Schema
   *
   * @return {object} JSON Schema
  */
  function resolveAllOf(schema) {
    if (schema.allOf) {
      schema = _.merge.apply(null, [schema].concat(schema.allOf));
      delete schema.allOf;
    }

    if (_.isObject(schema.properties)) {
      schema.properties = _.keys(schema.properties)
      .reduce(function(properties, key) {
        properties[key] = resolveAllOf(schema.properties[key]);
        return properties;
      }, {});
    }

    return schema;
  }

  this.resolveAllOf = resolveAllOf;
});
