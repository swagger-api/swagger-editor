'use strict';

var angular = require('angular');
var _ = require('lodash');

SwaggerEditor.service('JSONSchema', function JSONschema() {
  /**
   * Appends JSON Editor options for schema recursively so if a schema needs to
   * be edited by JSON Editor loosely it's possible
   *
   * @param {object} schema - A JSON Schema object
   *
   * @return {object} - A JSON Schema object
  */
  function appendJSONEditorOptions(schema) {
    var looseOptions = {
      /*eslint-disable */
      no_additional_properties: false,
      disable_properties: false,
      disable_edit_json: false
      /*eslint-enable */
    };

    // If schema is loose add options for JSON Editor
    if (isLooseJSONSchema(schema)) {
      schema.options = looseOptions;
    }

    _.each(schema.properties, appendJSONEditorOptions);

    return schema;
  }

  /**
   * Determines if a JSON Schema is loose
   *
   * @param {object} schema - A JSON Schema object
   *
   * @return {boolean} true if schema is a loose JSON
  */
  function isLooseJSONSchema(schema) {
    // loose object
    if (schema.additionalProperties || _.isEmpty(schema.properties)) {
      return true;
    }

    // loose array of objects
    if (
        schema.type === 'array' &&
        (schema.items.additionalProperties ||
        _.isEmpty(schema.items.properties))
      ) {
      return true;
    }

    return false;
  }

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

  /**
   * Fills in empty gaps of a JSON Schema. This method is mostly used to
   * normalize JSON Schema objects that are abstracted from Swagger parameters
   *
   * @param {object} schema - JSON Schema
   *
   * @return {object} - Normalized JSON Schema
  */
  function normalizeJSONSchema(schema) {
    // provide title property if it's missing.
    if (!schema.title && angular.isString(schema.name)) {
      schema.title = schema.name;
    }

    schema = resolveAllOf(schema);

    // if schema is missing the "type" property fill it in based on available
    // properties
    if (!schema.type) {
      // it's an object if it has "properties" property
      if (schema.properties) {
        schema.type = 'object';
      }

      // it's an array if it has "items" property
      if (schema.items) {
        schema.type = 'array';
      }
    }

    // Swagger extended JSON Schema with a new type, file. If we see file type
    // we will add format: file to the schema so the form generator will render
    // a file input
    if (schema.type === 'file') {
      schema.type = 'string';
      schema.format = 'file';
    }

    return appendJSONEditorOptions(schema);
  }

  this.normalizeJSONSchema = normalizeJSONSchema;
  this.resolveAllOf = resolveAllOf;
  this.appendJSONEditorOptions = appendJSONEditorOptions;
  this.isLooseJSONSchema = isLooseJSONSchema;
});
