'use strict';

SwaggerEditor.service('KeywordMap', function KeywordMap(defaults) {
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
    'application/json': String,
    'text/plain': String,
    'ext/html': String,
    'application/octet-stream': String,
    'application/xml': String,
    'text/xml': String
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
    format: String
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
    parameters: {
      '.': parameter
    },
    responses: {
      '.': response
    },
    tags: {
      // Tag index
      '.': String
    }
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
    schemas: {

      // schema index (number)
      '.': schemes
    },
    basePath: String,
    produces: {
      '.': mimeTypes
    },
    consumes: {
      '.': mimeTypes
    },

    paths: {
      //path
      '.': {
        parameters: parameter,
        '.': operation
      }
    },

    definitions: {

      // Definition name
      '.': {
        properties: {

          // property name
          '.': String
        }
      }
    },

    parameters: {
      '.': parameter
    },
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
    tags: {
      '.': {
        name: String,
        description: String
      }
    },
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
