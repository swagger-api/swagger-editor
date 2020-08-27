
import validateHelper, { expectNoErrors } from '../validate-helper.js';

describe('validation plugin - semantic - 2and3 schemas', () => {
  describe('array schemas must have an Object value in "items"', () => {
    it('should return an error for an array items value in Swagger 2', () => {
      const spec = {
        swagger: '2.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'myParam',
                  in: 'query',
                  type: 'array',
                  items: [{ type: 'object' }]
                }
              ]
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS();
        const firstError = allErrors[0];
        expect(allErrors.length).toEqual(1);
        expect(firstError.path).toEqual(['paths', '/pets', 'get', 'parameters', '0', 'items']);
        expect(firstError.message).toEqual('`items` must be an object');
      });
    });
    it('should return an error for an array items value in OpenAPI 3', () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'myParam',
                  in: 'query',
                  schema: {
                    type: 'array',
                    items: [{ type: 'object' }]
                  }
                },
              ]
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS();
        const firstError = allErrors[0];
        expect(allErrors.length).toEqual(1);
        expect(firstError.path).toEqual(['paths', '/pets', 'get', 'parameters', '0', 'schema', 'items']);
        expect(firstError.message).toEqual('`items` must be an object');
      });
    });
    it(
      'should return an error for a missing items value for an array schema in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    name: 'myParam',
                    in: 'query',
                    type: 'array'
                  }
                ]
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.message).toEqual('Schemas with \'type: array\', require a sibling \'items: \' field');
          expect(firstError.path).toEqual(['paths', '/pets', 'get', 'parameters', '0']);
        });
      }
    );
    it(
      'should return an error for a missing items value for an array schema in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    name: 'myParam',
                    in: 'query',
                    schema: {
                      type: 'array'
                    }
                  },
                ]
              }
            }
          }
        };

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.path).toEqual(['paths', '/pets', 'get', 'parameters', '0', 'schema']);
          expect(firstError.message).toEqual('Schemas with \'type: array\', require a sibling \'items: \' field');
        });
      }
    );
    it(
      'should not return an error for a missing items value for a non-array schema in Swagger 2',
      () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    name: 'myParam',
                    in: 'query',
                    type: 'object'
                  }
                ]
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
      'should not return an error for a missing items value for a non-array schema in OpenAPI 3',
      () => {
        const spec = {
          openapi: '3.0.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    name: 'myParam',
                    in: 'query',
                    schema: {
                      type: 'object'
                    }
                  },
                ]
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

  describe('minimums and maximums', () => {
    describe('OpenAPI 2.0', () => {
      it('should return an error when minimum is more than maximum', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyNumber: {
              minimum: 5,
              maximum: 2
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter( a => a.level == 'error'); // Ignore warnings
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toMatch(/.*minimum.*lower.*maximum.*/);
            expect(firstError.path).toEqual(['definitions', 'MyNumber', 'minimum']);
          });
      });
      it('should not return an error when minimum is less than maximum', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyNumber: {
              minimum: 1,
              maximum: 2
            }
          }
        };
        return expectNoErrors(spec);
      });
      it('should not return an error when minimum is equal to maximum', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyNumber: {
              minimum: 1,
              maximum: 1
            }
          }
        };
        return expectNoErrors(spec);
      });
      it(
        'should return an error when minProperties is more than maxProperties',
        () => {
          const spec = {
            swagger: '2.0',
            definitions: {
              MyObject: {
                minProperties: 5,
                maxProperties: 2
              }
            }
          };

          return validateHelper(spec)
            .then(system => {
              let allErrors = system.errSelectors.allErrors().toJS();
              allErrors = allErrors.filter(a => a.level === 'error'); // ignore warnings
              expect(allErrors.length).toEqual(1);
              const firstError = allErrors[0];
              expect(firstError.message).toMatch(/.*minProperties.*lower.*maxProperties.*/);
              expect(firstError.path).toEqual(['definitions', 'MyObject', 'minProperties']);
            });
        }
      );
      it(
        'should not return an error when minProperties is less than maxProperties',
        () => {
          const spec = {
            swagger: '2.0',
            definitions: {
              MyObject: {
                minProperties: 1,
                maxProperties: 2
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
      it(
        'should not return an error when minProperties is equal to maxProperties',
        () => {
          const spec = {
            swagger: '2.0',
            definitions: {
              MyObject: {
                minProperties: 1,
                maxProperties: 1
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
      it('should return an error when minLength is more than maxLength', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyString: {
              minLength: 5,
              maxLength: 2
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter(a => a.level === 'error'); // ignore warnings
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['definitions', 'MyString', 'minLength']);
            expect(firstError.message).toMatch(/.*minLength.*lower.*maxLength.*/);
          });
      });
      it(
        'should not return an error when minLength is less than maxLength',
        () => {
          const spec = {
            swagger: '2.0',
            definitions: {
              MyString: {
                minLength: 1,
                maxLength: 2
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
      it('should not return an error when minLength is equal to maxLength', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyString: {
              minLength: 1,
              maxLength: 1
            }
          }
        };

        return expectNoErrors(spec);
      });
      it('should return an error when minItems is more than maxItems', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyArray: {
              minItems: 5,
              maxItems: 2
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter(a => a.level === 'error'); // ignore warnings
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['definitions', 'MyArray', 'minItems']);
            expect(firstError.message).toMatch(/.*minItems.*lower.*maxItems.*/);
          });
      });
      it('should not return an error when minItems is less than maxItems', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyArray: {
              minItems: 1,
              maxItems: 2
            }
          }
        };

        return expectNoErrors(spec);
      });
      it('should not return an error when minItems is equal to maxItems', () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            MyArray: {
              minItems: 1,
              maxItems: 1
            }
          }
        };

        return expectNoErrors(spec);
      });
    });

    describe('OpenAPI 3.0', () => {
      it('should return an error when minimum is more than maximum', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyNumber: {
                minimum: 5,
                maximum: 2
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter( a => a.level == 'error'); // Ignore warnings
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toMatch(/.*minimum.*lower.*maximum.*/);
            expect(firstError.path).toEqual(['components', 'schemas', 'MyNumber', 'minimum']);
          });
      });
      it('should not return an error when minimum is less than maximum', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyNumber: {
                minimum: 1,
                maximum: 2
              }
            }
          }
        };
        return expectNoErrors(spec);
      });
      it('should not return an error when minimum is equal to maximum', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyNumber: {
                minimum: 1,
                maximum: 1
              }
            }
          }
        };
        return expectNoErrors(spec);
      });
      it(
        'should return an error when minProperties is more than maxProperties',
        () => {
          const spec = {
            openapi: '3.0.0',
            components: {
              schemas: {
                MyObject: {
                  minProperties: 5,
                  maxProperties: 2
                }
              }
            }
          };

          return validateHelper(spec)
            .then(system => {
              let allErrors = system.errSelectors.allErrors().toJS();
              allErrors = allErrors.filter(a => a.level === 'error'); // ignore warnings
              expect(allErrors.length).toEqual(1);
              const firstError = allErrors[0];
              expect(firstError.message).toMatch(/.*minProperties.*lower.*maxProperties.*/);
              expect(firstError.path).toEqual(['components', 'schemas', 'MyObject', 'minProperties']);
            });
        }
      );
      it(
        'should not return an error when minProperties is less than maxProperties',
        () => {
          const spec = {
            openapi: '3.0.0',
            components: {
              schemas: {
                MyObject: {
                  minProperties: 1,
                  maxProperties: 2
                }
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
      it(
        'should not return an error when minProperties is equal to maxProperties',
        () => {
          const spec = {
            openapi: '3.0.0',
            components: {
              schemas: {
                MyObject: {
                  minProperties: 1,
                  maxProperties: 1
                }
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
      it('should return an error when minLength is more than maxLength', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyString: {
                minLength: 5,
                maxLength: 2
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter(a => a.level === 'error'); // ignore warnings
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['components', 'schemas', 'MyString', 'minLength']);
            expect(firstError.message).toMatch(/.*minLength.*lower.*maxLength.*/);
          });
      });
      it(
        'should not return an error when minLength is less than maxLength',
        () => {
          const spec = {
            openapi: '3.0.0',
            components: {
              schemas: {
                MyString: {
                  minLength: 1,
                  maxLength: 2
                }
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
      it('should not return an error when minLength is equal to maxLength', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyString: {
                minLength: 1,
                maxLength: 1
              }
            }
          }
        };

        return expectNoErrors(spec);
      });
      it('should return an error when minItems is more than maxItems', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyArray: {
                minItems: 5,
                maxItems: 2
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter(a => a.level === 'error'); // ignore warnings
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['components', 'schemas', 'MyArray', 'minItems']);
            expect(firstError.message).toMatch(/.*minItems.*lower.*maxItems.*/);
          });
      });
      it('should not return an error when minItems is less than maxItems', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyArray: {
                minItems: 1,
                maxItems: 2
              }
            }
          }
        };

        return expectNoErrors(spec);
      });
      it('should not return an error when minItems is equal to maxItems', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              MyArray: {
                minItems: 1,
                maxItems: 1
              }
            }
          }
        };

        return expectNoErrors(spec);
      });
    });
  });
});

describe('values in Enum must be instance of the defined type', () => {
  // Numbers tests
  it(
    'should return an error for a text value in a enum number type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'number',
                  in: 'query',
                  schema: {
                    type: 'number',
                    enum: [1, 'text', 3]
                  }
                },
              ]
            }
          }
        }
      };

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          expect(allErrors[0]).toEqual(expect.objectContaining({
            level: 'warning',
            message: 'enum value should conform to its schema\'s `type`',
            path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 1]
          }));
        });
    }
  );

  it(
    'should return an error for a number value inside quotes in a enum number type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'number',
                  in: 'query',
                  schema: {
                    type: 'number',
                    enum: [1, 2, '3']
                  }
                },
              ]
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS();
        expect(allErrors.length).toEqual(1);
        expect(allErrors[0]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 2]
        }));
      });
    }
  );
  
  it(
    'should not return an error when all items are number in a enum number type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'number',
                  in: 'query',
                  schema: {
                    type: 'number',
                    enum: [1, 2, 3]
                  }
                },
              ]
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

  //Array Tests

  it(
    'should return an error for a non array value in a enum array type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'arraySample',
                  in: 'query',
                  schema: {
                    type: 'array',
                    enum: [1, 2, 3],     
                    items: {
                      type: 'array',
                      items: {
                        type: 'number'
                      }             
                    }
                  }
                },
              ]
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS().filter((err => err.source !== '')); 
        expect(allErrors.length).toEqual(3);
        expect(allErrors[0]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 0]
        }));
        expect(allErrors[1]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 1]
        }));
        expect(allErrors[2]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 2]
        }));
      });
    }
  );
  
  it(
    'should not return a type error when all items are array in a enum array type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'arraySample',
                  in: 'query',
                  schema: {
                    type: 'array',
                    enum: [[1,2],[3,4]],     
                    items: {
                      type: 'number'                    
                    }
                  }
                },
              ]
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

  //Object Tests

  it(
    'should return an error for a non object value (array) in a enum object type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'objectSample',
                  in: 'query',
                  schema: {
                    type: 'object',
                    enum: [[1,3], 2, 3]
                  }
                },
              ]
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS();
        expect(allErrors.length).toEqual(3);
        expect(allErrors[0]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 0]
        }));
        expect(allErrors[1]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 1]
        }));
        expect(allErrors[2]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 2]
        }));
      });
    }
  );

  it(
    'should return an error for a null value in a enum object type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'objectSample',
                  in: 'query',
                  schema: {
                    type: 'object',
                    enum: [null]
                  }
                },
              ]
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS();
        expect(allErrors[0]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 0]
        }));
      });
    }
  );
  
  it(
    'should not return an error when all items are array in a enum array type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'objectSample',
                  in: 'query',
                  schema: {
                    type: 'object',
                    enum: [{ok: 'Sample'},{}]
                  }
                },
              ]
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
 
  //Boolean Tests

  it(
    'should return an error for a non boolean value in a boolean array type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'booleanEnum',
                  in: 'query',
                  schema: {
                    type: 'boolean',
                    enum: [1, true, false]
                  }
                },
              ]
            }
          }
        }
      };

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS();
        expect(allErrors[0]).toEqual(expect.objectContaining({
          level: 'warning',
          message: 'enum value should conform to its schema\'s `type`',
          path: ['paths', '/pets', 'get', 'parameters', '0', 'schema', 'enum', 0]
        }));
      });
    }
  );
  
  it(
    'should not return an error when all items are boolean in a boolean array type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'booleanEnum',
                  in: 'query',
                  schema: {
                    type: 'boolean',
                    enum: [true, false]
                  }
                },
              ]
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
    'should not return an error for a null value in a enum object when nullable is true type in OpenApi 3',
    () => {
      const spec = {
        openapi: '3.0.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  name: 'objectSample',
                  in: 'query',
                  schema: {
                    type: 'object',
                    nullable: true,
                    enum: [null]
                  }
                },
              ]
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

  describe('schema defaults must be present in enums', () => {
    it(
      'should return an error for an invalid Swagger 2 parameter definition',
      () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'num',
                    'in': 'query',
                    'type': 'number',
                    enum: [1, 2, 3],
                    default: 0
                  },
                ]
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.path).toEqual(['paths', '/pets', 'get', 'parameters', '0', 'default']);
            expect(firstError.message).toEqual('Default values must be present in `enum`');
          });
      }
    );
    it(
      'should return an error for an invalid Swagger 2 schema definition',
      () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'get': {
                responses: {
                  200: {
                    schema: {
                      $ref: '#/definitions/MySchema'
                    }
                  }
                }
              }
            }
          },
          'definitions': {
            'MySchema': {
              'type': 'number',
              enum: [1, 2, 3],
              default: 0
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.path).toEqual(['definitions', 'MySchema','default']);
            expect(firstError.message).toEqual('Default values must be present in `enum`');
          });
      }
    );
    it(
      'should return an error for an invalid OpenAPI 3 parameter definition',
      () => {
        const spec = {
          openapi: '3.0.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'num',
                    'in': 'query',
                    'type': 'number',
                    schema: {
                      enum: [1, 2, 3],
                      default: 0
                    }
                  },
                ]
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.path).toEqual(['paths', '/pets', 'get', 'parameters', '0', 'schema', 'default']);
            expect(firstError.message).toEqual('Default values must be present in `enum`');
          });
      }
    );
    it(
      'should return an error for an invalid OpenAPI 3 parameter component',
      () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            parameters: {
              MyParam: {
                'name': 'num',
                'in': 'query',
                'type': 'number',
                schema: {
                  enum: [1, 2, 3],
                  default: 0
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
            expect(firstError.path).toEqual(['components', 'parameters', 'MyParam', 'schema', 'default']);
            expect(firstError.message).toEqual('Default values must be present in `enum`');
          });
      }
    );
    it(
      'should return no errors for a Swagger 2 definition without default set',
      () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'num',
                    'in': 'query',
                    'type': 'number',
                    enum: [1, 2, 3]
                  },
                ]
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
      'should return no errors for an OpenAPI 3 definition without default set',
      () => {
        const spec = {
          openapi: '3.0.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'num',
                    'in': 'query',
                    'type': 'number',
                    schema: {
                      enum: [1, 2, 3]
                    }
                  },
                ]
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
      'should return no errors for a Swagger 2 definition without enum set',
      () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'num',
                    'in': 'query',
                    'type': 'number',
                    default: 0
                  },
                ]
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
      'should return no errors for an OpenAPI 3 definition without enum set',
      () => {
        const spec = {
          openapi: '3.0.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'num',
                    'in': 'query',
                    'type': 'number',
                    schema: {
                      default: 0
                    }
                  },
                ]
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
});