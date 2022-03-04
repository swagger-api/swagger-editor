
import validateHelper, { expectNoErrorsOrWarnings } from '../validate-helper.js';

describe('validation plugin - semantic - 2and3 refs', () => {
  describe('Ref siblings', () => {
    it(
      'should return a warning when another property is a sibling of a $ref in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/CoolPath': {
              get: {
                $ref: '#/components/schemas/abc',
                description: 'My very cool get'
              }
            }
          },
          components: {
            schemas: {
              abc: {}
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('Sibling values alongside $refs are ignored.\nTo add properties to a $ref, wrap the $ref into allOf, or move the extra properties into the referenced definition (if applicable).');
          expect(firstError.level).toEqual('warning');
          expect(firstError.path).toEqual(['paths', '/CoolPath', 'get', 'description']);
        });
      }
    );

    it(
      'should return a warning when another property is a sibling of a $ref in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {
              get: {
                $ref: '#/definitions/abc',
                description: 'My very cool get'
              }
            }
          },
          definitions: {
            abc: {}
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('Sibling values alongside $refs are ignored.\nTo add properties to a $ref, wrap the $ref into allOf, or move the extra properties into the referenced definition (if applicable).');
          expect(firstError.level).toEqual('warning');
          expect(firstError.path).toEqual(['paths', '/CoolPath', 'get', 'description']);
        });
      }
    );

    it(
      'should return no warnings when a $ref has no siblings in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/CoolPath': {
              get: {
                $ref: '#/components/schemas/abc'
              }
            }
          },
          components: {
            schemas: {
              abc: {}
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );

    it(
      'should return no warnings when a $ref has no siblings in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {
              get: {
                $ref: '#/definitions/abc'
              }
            }
          },
          definitions: {
            abc: {}
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );

    it(
      'should return no warnings when a path item $ref has siblings in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            $ref: '#/components/schemas/abc',
            '/CoolPath': {
              get: {
                $ref: '#/components/schemas/abc'
              }
            }
          },
          components: {
            schemas: {
              abc: {}
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );

    it(
      'should return no warnings when a path item $ref has siblings in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            $ref: '#/definitions/abc',
            '/CoolPath': {
              get: {
                $ref: '#/definitions/abc'
              }
            }
          },
          definitions: {
            abc: {}
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );

  });

  describe('Unused definitions', () => {
    it(
      'should return a warning when a definition is declared but not used in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              'x-Foo': {
                type: 'object'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('Definition was declared but never used in document');
          expect(firstError.level).toEqual('warning');
          expect(firstError.path).toEqual(['components', 'schemas', 'x-Foo']);
        });
      }
    );

    it(
      'should not return a warning when a definition with special characters is properly referenced in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/CoolPath': {
              get: {
                responses: {
                  200: {
                    content: {
                      'application/json': {
                        schema: {
                          $ref: '#/components/schemas/x~1Foo'
                        }
                      }
                    }
                  },
                  400: {
                    content: {
                      'application/json': {
                        schema: {
                          $ref: '#/components/schemas/x~0Bar'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          components: {
            schemas: {
              'x/Foo': {
                type: 'object'
              },
              'x~Bar': {
                type: 'object'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          // We want warnings only, without errors about invalid component names
          const allWarnings = system.errSelectors.allErrors().toJS()
            .filter(err => err.level === 'warning');
          expect(allWarnings.length).toEqual(0);
        });
      }
    );

    it(
      'should return a warning when a definition is declared but not used in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {}
          },
          definitions: {
            abc: {
              type: 'string'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('Definition was declared but never used in document');
          expect(firstError.level).toEqual('warning');
          expect(firstError.path).toEqual(['definitions', 'abc']);
        });
      }
    );

    it(
      'should not return a warning when a definition with special character is declared and used in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {
              get: {
                responses: {
                  200: {
                    schema: {
                      $ref: '#/definitions/x~1Foo'
                    }
                  },
                  400: {
                    schema: {
                      $ref: '#/definitions/x~0Bar'
                    }
                  }
                }
              }
            }
          },
          definitions: {
            'x/Foo': {
              type: 'object'
            },
            'x~Bar': {
              type: 'object'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(0);
        });
      }
    );

  });

  describe('Malformed $ref values', () => {
    it(
      'should return an error when a JSON pointer lacks a leading `#/` in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {
              $ref: '#myObj/abc'
            }
          },
          myObj: {
            abc: {
              type: 'string'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('$ref paths must begin with `#/`');
          expect(firstError.level).toEqual('error');
          expect(firstError.path).toEqual(['paths', '/CoolPath', '$ref']);
        });
      }
    );

    it(
      'should return an error when a JSON pointer lacks a leading `#/` in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/CoolPath': {
              $ref: '#myObj/abc'
            }
          },
          myObj: {
            abc: {
              type: 'string'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('$ref paths must begin with `#/`');
          expect(firstError.level).toEqual('error');
          expect(firstError.path).toEqual(['paths', '/CoolPath', '$ref']);
        });
      }
    );

    it(
      'should return no errors when a JSON pointer is a well-formed remote reference in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {
              $ref: 'http://google.com#/myObj/abc'
            },
          },
          myObj: {
            abc: {
              type: 'string',
              properties: {
                $ref: 'http://google.com/MyRegularURLReference'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors).toEqual([]);
        });
      }
    );

    it(
      'should return no errors when a JSON pointer is a well-formed remote reference in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/CoolPath': {
              $ref: 'http://google.com#/myObj/abc'
            },
          },
          myObj: {
            abc: {
              type: 'string',
              properties: {
                $ref: 'http://google.com/MyRegularURLReference'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors).toEqual([]);
        });
      }
    );

    it(
      'should return an error when a JSON pointer uses incorrect percent-encoding in Swagger 2',
      () => {
        const spec = {
          'swagger': '2.0',
          'paths': {
            '/foo': {
              'get': {
                'responses': {
                  '200': {
                    'description': 'Success',
                    'schema': {
                      '$ref': '#/definitions/foo bar'
                    }
                  }
                }
              }
            }
          },
          'definitions': {
            'foo bar': {
              'type': 'string'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors).toEqual(
            expect.arrayContaining(
              [
                expect.objectContaining({
                  level: 'warning',
                  message: 'Definition was declared but never used in document',
                  path: ['definitions', 'foo bar']
                }),
                expect.objectContaining({
                  level: 'error',
                  message: '$ref values must be RFC3986-compliant percent-encoded URIs',
                  path: ['paths', '/foo', 'get', 'responses', '200', 'schema', '$ref']
                })
              ]
            )
          );
        });
      }
    );

    it(
      'should return an error when a JSON pointer uses incorrect percent-encoding in OpenAPI 3',
      () => {
        const spec = {
          'openapi': '3.0.0',
          'paths': {
            '/foo': {
              'get': {
                'responses': {
                  '200': {
                    'description': 'Success',
                    'content': {
                      'application/json': {
                        'schema': {
                          '$ref': '#/components/schemas/foo bar'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          components: {
            schemas: {
              'foo bar': {
                'type': 'string'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors.length).toEqual(3);
          expect(allSemanticErrors).toEqual(
            expect.arrayContaining(
              [
                expect.objectContaining({
                  level: 'warning',
                  message: 'Definition was declared but never used in document',
                  path: ['components', 'schemas', 'foo bar']
                }),
                expect.objectContaining({
                  level: 'error',
                  message: '$ref values must be RFC3986-compliant percent-encoded URIs',
                  path: ['paths', '/foo', 'get', 'responses', '200', 'content', 'application/json', 'schema', '$ref']
                }),
                expect.objectContaining({
                  level: 'error',
                  message: 'Component names can only contain the characters A-Z a-z 0-9 - . _',
                  path: ['components', 'schemas', 'foo bar']
                }),
              ]
            ));
        });
      }
    );

    it(
      'should return no errors when a JSON pointer uses correct percent-encoding in Swagger 2',
      () => {
        const spec = {
          'swagger': '2.0',
          'paths': {
            '/foo': {
              'get': {
                'responses': {
                  '200': {
                    'description': 'Success',
                    'schema': {
                      '$ref': '#/definitions/foo%20bar'
                    }
                  }
                }
              }
            }
          },
          'definitions': {
            'foo bar': {
              'type': 'string'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors).toEqual([]);
        });
      }
    );

    it(
      'should return no errors when a JSON pointer uses correct percent-encoding in OpenAPI 3',
      () => {
        const spec = {
          'openapi': '3.0.0',
          'paths': {
            '/foo': {
              'get': {
                'responses': {
                  '200': {
                    'description': 'Success',
                    'content': {
                      'application/json': {
                        'schema': {
                          '$ref': '#/components/schemas/foo%20bar'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          components: {
            schemas: {
              'foo bar': {
                'type': 'string'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors.length).toEqual(1);
          expect(allSemanticErrors[0]).toEqual(expect.objectContaining({
            level: 'error',
            message: 'Component names can only contain the characters A-Z a-z 0-9 - . _',
            path: ['components', 'schemas', 'foo bar']
          }));
        });
      }
    );

  });

  describe('Nonexistent $ref pointers', () => {
    it(
      'should return an error when a local JSON pointer does not exist in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {
              $ref: '#/myObj/DoesNotExist'
            }
          },
          myObj: {
            abc: {
              type: 'string',
              properties: {
                $ref: 'http://google.com/MyRegularURLReference'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('$refs must reference a valid location in the document');
          expect(firstError.level).toEqual('error');
          expect(firstError.path).toEqual(['paths', '/CoolPath', '$ref']);
        });
      }
    );

    it(
      'should return an error when a local JSON pointer does not exist in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/CoolPath': {
              $ref: '#/myObj/DoesNotExist'
            }
          },
          myObj: {
            abc: {
              type: 'string',
              properties: {
                $ref: 'http://google.com/MyRegularURLReference'
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver')
            .filter((el, i, arr) => arr.indexOf(el) === i);
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toMatch('$refs must reference a valid location in the document');
          expect(firstError.level).toEqual('error');
          expect(firstError.path).toEqual(['paths', '/CoolPath', '$ref']);
        });
      }
    );

    it('should return no errors when a JSON pointer exists in Swagger 2', () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath': {
            $ref: '#/myObj/abc'
          },
        },
        myObj: {
          abc: {
            type: 'string'
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allSemanticErrors = system.errSelectors.allErrors().toJS()
          .filter(err => err.source !== 'resolver');
        expect(allSemanticErrors).toEqual([]);
      });
    });

    it('should return no errors when a JSON pointer exists in OpenAPI 3', () => {
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/CoolPath': {
            $ref: '#/myObj/abc'
          },
        },
        myObj: {
          abc: {
            type: 'string',
            properties: {
              $ref: 'http://google.com/MyRegularURLReference'
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allSemanticErrors = system.errSelectors.allErrors().toJS()
          .filter(err => err.source !== 'resolver');
        expect(allSemanticErrors).toEqual([]);
      });
    });

    it(
      'should return no errors when a JSON pointer is a remote reference in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath': {
              $ref: 'http://google.com#/myObj/abc'
            },
          },
          myObj: {
            abc: {
              type: 'string'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors).toEqual([]);
        });
      }
    );

    it(
      'should return no errors when a JSON pointer is a remote reference in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/CoolPath': {
              $ref: 'http://google.com#/myObj/abc'
            },
          },
          myObj: {
            abc: {
              type: 'string'
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allSemanticErrors = system.errSelectors.allErrors().toJS()
            .filter(err => err.source !== 'resolver');
          expect(allSemanticErrors).toEqual([]);
        });
      }
    );
  });
});
