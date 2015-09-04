'use strict';

SwaggerEditor.service('KeywordMap', function KeywordMap(defaults) {

  /*
   * JSON Schema completion map constructor
   *
   * This is necessary because JSON Schema completion map has recursive
   * pointers
  */
  function JSONSchema() {
    _.extend(this,
      {
        title: String,
        type: String,
        format: String,
        default: this,
        description: String,
        enum: [String],
        minimum: String,
        maximum: String,
        exclusiveMinimum: String,
        exclusiveMaximum: String,
        multipleOf: String,
        maxLength: String,
        minLength: String,
        pattern: String,
        not: String,
        definitions: {
          '.': this
        },

        // array specific keys
        items: [this],
        minItems: String,
        maxItems: String,
        uniqueItems: String,
        additionalItems: [this],

        // object
        maxProperties: String,
        minProperties: String,
        required: String,
        additionalProperties: String,
        allOf: [this],
        properties: {

          // property name
          '.': this
        }
      }
    );
  }

  var jsonSchema = new JSONSchema();
  var schemes = {
    http: String,
    https: String,
    ws: String,
    wss: String
  };

  var externalDocs = {
    description: String,
    url: String
  };

  var mimeTypes = {
    'text/plain': String,
    'text/html': String,
    'text/xml': String,
    'text/csv': String,
    'application/json': String,
    'application/octet-stream': String,
    'application/xml': String,
    'application/vnd.': String,
    'application/pdf': String,
    'audio/': String,
    'image/jpeg': String,
    'image/gif': String,
    'image/png': String,
    'multipart/form-data': String,
    'video/avi': String,
    'video/mpeg': String,
    'video/ogg': String,
    'video/mp4': String
  };

  var header = {
    name: String,
    description: String
  };

  var parameter = {
    name: String,
    in: String,
    description: String,
    required: String,
    type: String,
    format: String,
    schema: jsonSchema
  };

  var security = {
    '.': String
  };

  var response =  {
    description: String,
    schema: {
      type: String
    },
    headers: {
      '.': header
    },
    examples: mimeTypes
  };

  var operation = {
    summary: String,
    description: String,
    schemes: {
      '.': schemes
    },
    externalDocs: externalDocs,
    operationId: String,
    produces: {
      '.': mimeTypes
    },
    consumes: {
      '.': mimeTypes
    },
    deprecated: Boolean,
    security: security,
    parameters: [parameter],
    responses: {
      '.': response
    },
    tags: [String]
  };

  var map = {
    swagger: String,
    info: {
      version: String,
      title: String,
      description: String,
      termsOfService: String,
      contact: {
        name: String,
        url: String,
        email: String
      },
      license: {
        name: String,
        url: String
      }
    },

    host: String,
    basePath: String,

    schemes: [schemes],
    produces: [mimeTypes],
    consumes: [mimeTypes],

    paths: {

      //path
      '.': {
        parameters: [parameter],
        '.': operation
      }
    },

    definitions: {

      // Definition name
      '.': jsonSchema
    },

    parameters: [parameter],
    responses: {
      '.': response
    },
    security: {
      '.': {
        '.': String
      }
    },
    securityDefinitions: {
      '.': {
        '.': String
      }
    },
    tags: [{
      name: String,
      description: String
    }],
    externalDocs: {
      '.': externalDocs
    }
  };

  this.get = function () {
    var extension = angular.isObject(defaults.autocompleteExtension) ?
      defaults.autocompleteExtension : {};
    return _.extend(map, extension);
  };
});
