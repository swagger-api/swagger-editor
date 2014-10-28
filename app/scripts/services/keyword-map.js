'use strict';

PhonicsApp.service('KeywordMap', function KeywordMap() {

  this.get = function () {
    return {
      swagger: String,
      info: {
        version: String,
        title: String,
        contact: {
          name: String,
          url: String,
          email: String
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

          // operation
          '.': {
            summary: String,
            description: String,
            parameters: {

              // parameter index
              '.': {
                name: String,
                in: String,
                description: String,
                required: String,
                type: String,
                format: String
              }
            },

            responses: {

              // response code
              '.': {
                description: String,
                schema: {
                  type: String
                }
              }
            },

            tags: {

              // Tag index
              '.': String
            }
          }
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
      }
    };
  };
});
