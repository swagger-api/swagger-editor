
import validateHelper, {
  expectNoErrors,
  expectNoErrorsOrWarnings
} from './validate-helper.js';

describe('validation plugin - semantic - schema', () => {
  it(
    'should return an error when a definition\'s property is readOnly and required by the schema',
    () => {
      const spec = {
        swagger: '2.0',
        blah: {
          $ref: '#/definitions/CoolModel'
        },
        definitions: {
          CoolModel: {
            required: ['BadProperty'],
            properties: {
              BadProperty: {
                readOnly: true
              }
            }
          }
        }
      };

      return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toEqual('Read only properties cannot be marked as required by a schema.');
            expect(firstError.path).toEqual(['definitions', 'CoolModel', 'required', '0']);
          });

    }
  );

  it(
    'should not return an error when a definition\'s property is not readOnly and required by the schema',
    () => {
      const spec = {
        swagger: '2.0',
        definitions: {
          CoolModel: {
            required: ['BadProperty'],
            properties: {
              BadProperty: {
                type: 'string'
              }
            }
          }
        }
      };


      return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors
                  .allErrors()
                  .filter(a => a.get('level') === 'error') // We have an incidental "warning"
                  .toJS();
            expect(allErrors.length).toEqual(0);
          });
    }
  );

  it(
    'should return an error when a response schema\'s property is readOnly and required by the schema',
    () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath': {
            get: {
              responses: {
                200: {
                  schema: {
                    required: ['BadProperty'],
                    properties: {
                      BadProperty: {
                        readOnly: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors
                  .allErrors()
                  .toJS();

            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];

            expect(firstError.message).toEqual('Read only properties cannot be marked as required by a schema.');
            expect(firstError.path).toEqual(['paths', '/CoolPath', 'get', 'responses', '200', 'schema', 'required', '0']);
          });
    }
  );

  it(
    'should not return an error when a response schema\'s property is not readOnly and required by the schema',
    () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath': {
            get: {
              responses: {
                200: {
                  schema: {
                    required: ['BadProperty'],
                    properties: {
                      BadProperty: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );

  it(
    'should return an error when a parameter schema\'s property is readOnly and required by the schema',
    () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath': {
            get: {
              parameters: [{
                name: 'BadParameter',
                in: 'body',
                schema: {
                  required: ['BadProperty'],
                  properties: {
                    BadProperty: {
                      readOnly: true
                    }
                  }
                }
              }]
            }
          }
        }
      };

      return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors
                  .allErrors()
                  .toJS();

            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toEqual('Read only properties cannot be marked as required by a schema.');
            expect(firstError.path).toEqual(['paths', '/CoolPath', 'get', 'parameters', '0', 'schema', 'required', '0']);
          });
    }
  );

  it(
    'should not return an error when a parameter schema\'s property is not readOnly and required by the schema',
    () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath': {
            get: {
              parameters: [{
                name: 'BadParameter',
                in: 'body',
                schema: {
                  required: ['BadProperty'],
                  properties: {
                    BadProperty: {
                      type: 'string'
                    }
                  }
                }
              }]
            }
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );

  describe('Type key', () => {
    it('should return an error when "type" is an array', () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath': {
            get: {
              responses: {
                '200': {
                  schema: {
                    type: ['number', 'string']
                  }
                }
              }
            }
          }
        }
      };

      return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors
                  .allErrors()
                  .toJS();

            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toEqual('Schema "type" key must be a string');
            expect(firstError.path).toEqual(['paths', '/CoolPath', 'get', 'responses', '200', 'schema', 'type']);
          });
    });
    it('should not return an error when "type" is a property name', () => {
      const spec = {
        'swagger': '2.0',
        'definitions': {
          'ApiResponse': {
            'type': 'object',
            'properties': {
              'code': {
                'type': 'integer',
                'format': 'int32'
              },
              'type': {
                'type': 'string'
              },
              'message': {
                'type': 'string'
              }
            }
          }
        }
      };

      return validateHelper(spec)
        .then(system => {
          let allErrors = system.errSelectors.allErrors().toJS();
          allErrors = allErrors.filter(a => a.level != 'warning'); // ignore warnings
          expect(allErrors.length).toEqual(0);
        });
    });
    it(
      'should not return an error when "type" is a property name inside additionalProperties',
      () => {
        const spec = {
          'swagger': '2.0',
          'definitions': {
            'ApiResponse': {
              'type': 'object',
              'additionalProperties': {
                'type': 'object',
                'properties': {
                  'code': {
                    'type': 'integer',
                    'format': 'int32'
                  },
                  'type': {
                    'type': 'string'
                  },
                  'message': {
                    'type': 'string'
                  }
                }
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter(a => a.level != 'warning'); // ignore warnings
            expect(allErrors.length).toEqual(0);
          });
      }
    );
    it('should not return an error when "type" is a model name', () => {
      const spec = {
        'swagger': '2.0',
        'definitions': {
          'type': {
            'type': 'object',
            'properties': {
              'code': {
                'type': 'integer',
                'format': 'int32'
              },
              'message': {
                'type': 'string'
              }
            }
          }
        }
      };

      return expectNoErrors(spec);
    });
  });

  describe('"type: array" requires "items"', () => {
    describe('header objects', () => {
      // It takes a while to start up swagger-ui, for some reason

      it(
        'should return an error when an array header object omits an `items` property',
        () => {

          // Given
          const spec = {
            'swagger': '2.0',
            'info': {
              'version': '1.0.0',
              'title': 'Swagger Petstore'
            },
            'paths': {
              '/pets': {
                'get': {
                  'description': 'Returns all pets from the system that the user has access to',
                  'responses': {
                    '200': {
                      'description': 'pet response',
                      'headers': {
                        'X-MyHeader': {
                          'type': 'array'
                        }
                      }
                    },
                    'default': {
                      'description': 'unexpected error'
                    }
                  }
                }
              }
            }
          };

          // When
          return validateHelper(spec)
            .then(system => {

              // Then
              expect(system.errSelectors.allErrors().count()).toEqual(1);
              const firstError = system.errSelectors.allErrors().first().toJS();
              expect(firstError.message).toMatch(/.*type.*array.*require.*items/);
              expect(firstError.path).toEqual(['paths', '/pets', 'get', 'responses', '200', 'headers', 'X-MyHeader']);
            });

        }
      );

      it(
        'should not return an error when an array header object has an `items` property',
        () => {
          const spec = {
            'swagger': '2.0',
            'info': {
              'version': '1.0.0',
              'title': 'Swagger Petstore'
            },
            'paths': {
              '/pets': {
                'get': {
                  'description': 'Returns all pets from the system that the user has access to',
                  'responses': {
                    '200': {
                      'description': 'pet response',
                      'headers': {
                        'X-MyHeader': {
                          'type': 'array',
                          'items': {
                            'type': 'string'
                          }
                        }
                      }
                    },
                    'default': {
                      'description': 'unexpected error'
                    }
                  }
                }
              }
            }
          };

          return expectNoErrorsOrWarnings(spec);
        }
      );
    });
    describe('definitions', () => {
      // It takes a while to start up swagger-ui, for some reason

      it(
        'should return an error when an array definition omits an `items` property',
        () => {

          // Given
          const spec = {
            swagger: '2.0',
            paths: {
              $ref: '#/definitions/asdf'
            },
            'definitions': {
              'asdf': {
                type: 'array'
              }
            }
          };

          // When
          return validateHelper(spec)
            .then(system => {

              // Then
              expect(system.errSelectors.allErrors().count()).toEqual(1);
              const firstError = system.errSelectors.allErrors().first().toJS();
              expect(firstError.message).toMatch(/.*type.*array.*require.*items/);
              expect(firstError.path).toEqual(['definitions', 'asdf']);
            });

        }
      );

      it(
        'should not return an error when an array definition has an `items` property',
        () => {
          const spec = {
            'swagger': '2.0',
            'info': {
              'version': '1.0.0',
              'title': 'Swagger Petstore'
            },
            'paths': {
              '/pets': {
                'get': {
                  'description': 'Returns all pets from the system that the user has access to',
                  'responses': {
                    '200': {
                      'description': 'pet response',
                      'headers': {
                        'X-MyHeader': {
                          $ref: '#/definitions/array'
                        }
                      }
                    },
                    'default': {
                      'description': 'unexpected error'
                    }
                  }
                }
              }
            },
            'definitions': {
              'array': {
                'type': 'array',
                'items': {
                  'type': 'string'
                }
              }
            }
          };

          return expectNoErrorsOrWarnings(spec);
        }
      );
    });
    describe('\'pattern\' Z anchors', () => {
      it(
        'should return an error when a schema has a Z anchor in its pattern',
        () => {

          // Given
          const spec = {
            swagger: '2.0',
            paths: {
              $ref: '#/definitions/asdf'
            },
            'definitions': {
              'asdf': {
                type: 'string',
                pattern: '^[-a-zA-Z0-9_]+\\Z'
              }
            }
          };

          // When
          return validateHelper(spec)
            .then(system => {

              // Then
              expect(system.errSelectors.allErrors().count()).toEqual(1);
              const firstError = system.errSelectors.allErrors().first().toJS();
              expect(firstError.message).toEqual('"\\Z" anchors are not allowed in regular expression patterns');
              expect(firstError.path).toEqual(['definitions', 'asdf', 'pattern']);
            });

        }
      );
      it(
        'should return an error when a subschema has a Z anchor in its pattern',
        () => {

          // Given
          const spec = {
            swagger: '2.0',
            paths: {
              '/': {
                get: {
                  responses: {
                    '200': {
                      schema: {
                        type: 'object',
                        properties: {
                          slug: {
                            type: 'string',
                            pattern: '^[-a-zA-Z0-9_]+\\Z'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
          };

          // When
          return validateHelper(spec)
            .then(system => {
              // Then
              expect(system.errSelectors.allErrors().count()).toEqual(1);
              const firstError = system.errSelectors.allErrors().first().toJS();
              expect(firstError.message).toEqual('"\\Z" anchors are not allowed in regular expression patterns');
              expect(firstError.path).toEqual(['paths', '/', 'get', 'responses', '200', 'schema', 'properties', 'slug', 'pattern']);
            });

        }
      );

      it(
        'should not return an error when a regex pattern doesn\'t use a Z anchor',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              $ref: '#/definitions/asdf'
            },
            'definitions': {
              'asdf': {
                type: 'string',
                pattern: '^[-a-zA-Z0-9_]+'
              }
            }
          };

          return expectNoErrorsOrWarnings(spec);
        }
      );
    });
  });
});
