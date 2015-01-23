'use strict';

SwaggerEditor.service('KeywordMap', function KeywordMap(defaults) {
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
      '.': String
    },
    examples: {
      '.': String
    }
  };
  var operation = {
    summary: String,
    description: String,
    schemes: {
      '.': String
    },
    externalDocs: {
      '.': String
    },
    operationId: String,
    produces: {
      '.': String
    },
    consumes: {
      '.': String
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
      '.': String
    },
    basePath: String,
    produces: {
      '.': String
    },
    consumes: {
      '.': String
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
      '.': String
    },
    externalDocs: {
      '.': String
    }
  };

  this.get = function () {
    var extension = angular.isObject(defaults.autocompleteExtension) ?
      defaults.autocompleteExtension : {};
    return _.extend(map, extension);
  };
});
