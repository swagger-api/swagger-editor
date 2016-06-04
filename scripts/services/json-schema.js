'use strict';

var _ = require('lodash');

SwaggerEditor.service('JSONschema', function JSONschema() {
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

  this.appendJSONEditorOptions = appendJSONEditorOptions;
  this.isLooseJSONSchema = isLooseJSONSchema;
});
