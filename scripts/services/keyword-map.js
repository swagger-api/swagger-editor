'use strict';

var _ = require('lodash');
var angular = require('angular');

SwaggerEditor.service('KeywordMap', function KeywordMap(defaults) {
  /*
   * JSON Schema completion map constructor
   *
   * This is necessary because JSON Schema completion map has recursive
   * pointers
  */
  /* eslint quote-props: ["error", "as-needed", { "keywords": false, "unnecessary": false }]*/
  var JSONSchema = function() {
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

        // jscs:disable
        '$ref': String,
        // jscs:enable

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
  };

  var jsonSchema = new JSONSchema();
  var schemes = [
    'http',
    'https',
    'ws',
    'wss'
  ];

  var externalDocs = {
    description: String,
    url: String
  };

  var mimeTypes = [
    'text/plain',
    'text/html',
    'text/xml',
    'text/csv',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'application/vnd.',
    'application/pdf',
    'audio/',
    'image/jpeg',
    'image/gif',
    'image/png',
    'multipart/form-data',
    'video/avi',
    'video/mpeg',
    'video/ogg',
    'video/mp4'
  ];

  var header = {
    name: String,
    description: String
  };

  var parameter = {
    name: String,
    in: [
      'body',
      'formData',
      'header',
      'path',
      'query'
    ],
    description: String,
    required: ['true', 'false'],
    type: [
      'string',
      'number',
      'boolean',
      'integer',
      'array'
    ],
    format: String,
    schema: jsonSchema
  };

  var security = {
    '.': String
  };

  var response = {
    description: String,
    schema: jsonSchema,
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

  var securityDefinition = {
    type: ['oauth2', 'apiKey', 'basic'],
    name: String,
    flow: ['application', 'implicit', 'accessCode'],
    scopes: String,
    tokenUrl: String,
    authorizationUrl: String,
    description: String
  };

  var map = {
    swagger: ['"2.0"'],
    info: {
      version: [
        '1.0.0',
        '0.0.0',
        '0.0.1',
        'something-we-all-get'
      ],
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

      // path
      '^/.?': {
        'parameters': [parameter],
        'get|put|post|delete|options|head|patch': operation
      }
    },

    definitions: {

      // Definition name
      '.': jsonSchema
    },

    parameters: [parameter],
    responses: {
      '[2-6][0-9][0-9]': response
    },
    security: {
      '.': {
        '.': String
      }
    },
    securityDefinitions: {
      '.': securityDefinition
    },
    tags: [{
      name: String,
      description: String
    }],
    externalDocs: {
      '.': externalDocs
    }
  };

  this.get = function() {
    var extension = angular.isObject(defaults.autocompleteExtension) ?
      defaults.autocompleteExtension : {};
    return _.extend(map, extension);
  };
});
