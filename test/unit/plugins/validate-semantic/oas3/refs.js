
import validateHelper, { expectNoErrorsOrWarnings } from '../validate-helper.js';

describe('validation plugin - semantic - oas3 refs', () => {
  describe('$refs for request bodies must reference a request body by position', () => {
    it(
      'should return an error when a requestBody incorrectly references a local component schema',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: '#/components/schemas/MySchema'
                }
              }
            }
          },
          components: {
            schemas: {
              MySchema: {
                type: 'string'
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.message).toEqual('requestBody $refs cannot point to \'#/components/schemas/…\', they must point to \'#/components/requestBodies/…\'');
            expect(firstError.path).toEqual(['paths', '/', 'post', 'requestBody', '$ref']);
          });
      }
    );
    it(
      'should not return an error when a requestBody references a remote component schema',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: 'http://google.com/#/components/schemas/MySchema'
                }
              }
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );
    it(
      'should return an error when a requestBody in a callback incorrectly references a local component schema',
      () => {
        const spec = {
          openapi: '3.0.0',
          info: null,
          version: '1.0.0-oas3',
          title: 'example',
          paths: {
            '/api/callbacks': {
              post: {
                responses: {
                  '200': {
                    description: 'OK'
                  }
                },
                callbacks: {
                  callback: {
                    '/callback': {
                      post: {
                        requestBody: {
                          $ref: '#/components/schemas/callbackRequest'
                        },
                        responses: {
                          '200': {
                            description: 'OK'
                          }
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
              callbackRequest: {
                type: 'object',
                properties: {
                  property1: {
                    type: 'integer',
                    example: 10000
                  }
                }
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.message).toEqual('requestBody $refs cannot point to \'#/components/schemas/…\', they must point to \'#/components/requestBodies/…\'');
            expect(firstError.path).toEqual(['paths', '/api/callbacks', 'post', 'callbacks',
            'callback', '/callback', 'post', 'requestBody', '$ref']);
          });
      }
    );
    it(
      'should return no errors when a requestBody correctly references a local component request body',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: '#/components/requestBodies/MyBody'
                }
              }
            }
          },
          components: {
            requestBodies: {
              MyBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
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
      'should return no errors when a requestBody correctly references a local operation request body',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: '#/paths/~1/put/requestBody'
                }
              },
              put: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'string'
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
      'should return no errors when a requestBody correctly references a remote component request body',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: 'http://google.com/#/components/requestBodies/MyBody'
                }
              }
            }
          },
          components: {
            requestBodies: {
              MyBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
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
      'should return no errors when a requestBody correctly references a remote https component request body',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: 'https://example.com/file.yaml#/components/requestBodies/group1/addPetBody'
                }
              }
            }
          },
          components: {
            requestBodies: {
              MyBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
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
      'should return no errors when a requestBody correctly references an external yaml file',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: 'addPetBody.yaml'
                }
              }
            }
          },
          components: {
            requestBodies: {
              MyBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
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
      'should return no errors when a requestBody correctly references an external yaml pointing some node',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
                requestBody: {
                  $ref: './components.yaml#/path/to/some/node'
                }
              }
            }
          },
          components: {
            requestBodies: {
              MyBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
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
  });

  describe('$refs for requestbody schemas must reference a schema by position', () => {
    it(
      'should return an error when a requestBody schema incorrectly references a local component requestBody',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              post: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/requestBodies/Foo'
                      }
                    }
                  }
                }
              }
            }
          },
          components: {
            requestBodies: {
              Foo: {
                type: 'string'
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const allSemanticErrors = allErrors.filter(err => err.source === 'semantic');

            expect(allSemanticErrors.length).toEqual(1);

            const firstError = allSemanticErrors[0];

            expect(firstError.message).toEqual('requestBody schema $refs must point to a position where a Schema Object can be legally placed');
            expect(firstError.path).toEqual(['paths', '/foo', 'post', 'requestBody', 'content', 'application/json', 'schema', '$ref']);

          });
      }
    );

    it(
      'should not return an error when a requestBody schema references a local component schema',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              post: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Foo'
                      }
                    }
                  }
                }
              }
            }
          },
          components: {
            schemas: {
              Foo: {
                type: 'string'
              }
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

    it(
      'should not return an error when a requestBody schema references remote document paths',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              post: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: 'http://google.com#/Foo'
                      }
                    }
                  }
                }
              }
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

    it(
      'should not return an error when a requestBody schema references entire remote documents',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              post: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: 'addPetBody.yaml'
                      }
                    }
                  }
                }
              }
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

    it(
      'should not return an error when a requestBody schema references local operation requestBody schemas',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              post: {
                responses: {
                  '200': {
                    description: 'OK'
                  }
                },
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'string'
                      }
                    }
                  }
                }
              },
              put: {
                requestBody: {
                  responses: {
                    '200': {
                      description: 'OK'
                    }
                  },
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/paths/~1foo/post/requestBody/content/application~1json/schema'
                      }
                    }
                  }
                }
              }
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

  describe('response header $refs should not point to parameters', () => {
    it(
      'should return an error when a response header incorrectly references a local parameter component',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              get: {
                responses: {
                  '200': {
                    description: 'OK',
                    headers: {
                      'X-MyHeader': {
                        $ref: '#/components/parameters/MyHeader'
                      }
                    }

                  }
                }
              }
            }
          },
          components: {
            headers: {
              MyHeader: {
                $ref: '#/components/parameters/MyHeader'
              }
            },
            parameters: {
              MyHeader: {}
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const [firstError, secondError] = allErrors;
            expect(allErrors.length).toEqual(2);
            expect(firstError.message).toEqual('OAS3 header $refs should point to Header Object and not #/components/parameters/MyHeader');
            expect(firstError.path).toEqual(['paths', '/foo', 'get','responses','200', 'headers', 'X-MyHeader', '$ref']);
            expect(secondError.message).toEqual('OAS3 header $refs should point to Header Object and not #/components/parameters/MyHeader');
            expect(secondError.path).toEqual(['components', 'headers', 'MyHeader', '$ref']);
          });
      }
    );

    it(
      'should return no errors when a response header correctly references a local header component',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              get: {
                responses: {
                  '200': {
                    description: 'OK',
                    headers: {
                      'X-MyHeader': {
                        $ref: '#/components/headers/MyHeader'
                      }
                    }

                  }
                }
              }
            }
          },
          components: {
            headers: {
              MyHeader: {
                $ref: '#/components/headers/MyHeader'
              }
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );

    it('should return no errors for external $refs in response headers', () => {
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/foo': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  headers: {
                    'X-MyHeader': {
                      $ref: 'https://www.google.com/#/components/parameter/MyHeader'
                    }
                  }

                }
              }
            }
          }
        },
        components: {
          headers: {
            MyHeader: {
              $ref: '#/components/headers/MyHeader'
            }
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    });
  });

  describe('parameter $refs should not point to header components', () => {
    it(
      'should return an error when a parameter incorrectly references a response header component',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              parameters: [
                {
                  $ref: '#/components/headers/foo'
                }
              ],
              get: {
                parameters: [
                  {
                    $ref: '#/components/headers/foo'
                  }
                ],
                responses: {
                  '200': {
                    description: 'OK'
                  }
                }
              }
            }
          },
          components: {
            parameters: {
              myParam: {
                $ref: '#/components/headers/foo'
              }
            },
            headers: {
              foo: {}
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(3);
            const firstError = allErrors[0];
            expect(firstError.message).toEqual('OAS3 parameter $refs should point to Parameter Object and not #/components/headers/foo');
            expect(firstError.path).toEqual(['paths','/foo','parameters', '0', '$ref']);
            const secondError = allErrors[1];
            expect(secondError.message).toEqual('OAS3 parameter $refs should point to Parameter Object and not #/components/headers/foo');
            expect(secondError.path).toEqual(['paths','/foo','get','parameters', '0', '$ref']);
            const thirdError = allErrors[2];
            expect(thirdError.message).toEqual('OAS3 parameter $refs should point to Parameter Object and not #/components/headers/foo');
            expect(thirdError.path).toEqual(['components','parameters', 'myParam', '$ref']);
          });
      }
    );

    it(
      'should return no errors when a parameter correctly references a parameter component',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/foo': {
              parameters: [
                {
                  $ref: '#/components/parameters/foo'
                }
              ],
              get: {
                 parameters: [
                {
                  $ref: '#/components/parameters/foo'
                }
              ],
                responses: {
                  '200': {
                    description: 'OK'
                  }
                }
              }
            }
          },
          components: {
            parameters: {
              foo: {
                $ref: '#/components/parameters/foo'
              }
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );

    it('should return no errors for external parameter $refs', () => {
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/foo': {
            parameters: [
              {
                $ref: 'http://www.google.com/#/components/parameters/foo'
              }
            ],
            get: {
              parameters: [
                {
                  $ref: 'http://www.google.com/#/components/parameters/foo'
                }
              ],
              responses: {
                '200': {
                  description: 'OK'
                }
              }
            }
          }
        },
        components: {
          parameters: {
            foo: {
              $ref: 'http://www.google.com/#/components/parameters/foo'
            }
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    });
  });
});
