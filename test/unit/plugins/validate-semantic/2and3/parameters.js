
import validateHelper from '../validate-helper.js';

describe('validation plugin - semantic - 2and3 parameters', () => {
  describe('parameters must have unique name + in values', () => {
    describe('direct siblings', () => {
      it('should return an error for an invalid Swagger 2 definition', () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'parameters': [
                {
                  'name': 'pathLevel',
                  'in': 'query',
                  'description': 'tags to filter by',
                  'type': 'string'
                },
                {
                  'name': 'pathLevel',
                  'in': 'query',
                  'description': 'tags to filter by',
                  'type': 'string'
                },
              ],
              'get': {
                'parameters': [
                  {
                    'name': 'opLevel',
                    'in': 'query',
                    'description': 'tags to filter by',
                    'type': 'string'
                  },
                  {
                    'name': 'opLevel',
                    'in': 'query',
                    'description': 'tags to filter by',
                    'type': 'string'
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
            const secondError = allErrors[1];
            expect(allErrors.length).toEqual(2);
            expect(firstError.path).toEqual(['paths', '/pets', 'parameters', '1']);
            expect(firstError.message).toEqual('Sibling parameters must have unique name + in values');
            expect(secondError.path).toEqual(['paths', '/pets', 'get', 'parameters', '1']);
            expect(secondError.message).toEqual('Sibling parameters must have unique name + in values');
          });
      });
      it('should return an error for an invalid OpenAPI 3 definition', () => {
        const spec = {
          openapi: '3.0.0',
          'paths': {
            '/pets': {
              'parameters': [
                {
                  'name': 'pathLevel',
                  'in': 'query',
                  'description': 'tags to filter by',
                  'schema': {
                    'type': 'string'
                  }
                },
                {
                  'name': 'pathLevel',
                  'in': 'query',
                  'description': 'tags to filter by',
                  'schema': {
                    'type': 'string'
                  }
                },
              ],
              'get': {
                'parameters': [
                  {
                    'name': 'opLevel',
                    'in': 'query',
                    'description': 'tags to filter by',
                    'schema': {
                      'type': 'string'
                    }
                  },
                  {
                    'name': 'opLevel',
                    'in': 'query',
                    'description': 'tags to filter by',
                    'schema': {
                      'type': 'string'
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
            const secondError = allErrors[1];
            expect(allErrors.length).toEqual(2);
            expect(firstError.path).toEqual(['paths', '/pets', 'parameters', '1']);
            expect(firstError.message).toEqual('Sibling parameters must have unique name + in values');
            expect(secondError.path).toEqual(['paths', '/pets', 'get', 'parameters', '1']);
            expect(secondError.message).toEqual('Sibling parameters must have unique name + in values');
          });
      });
      it('should return no errors for a valid Swagger 2 definition', () => {
        const spec = {
          swagger: '2.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'wags',
                    'in': 'query',
                    'description': 'wags to filter by',
                    'type': 'string'
                  },
                  {
                    'name': 'tags',
                    'in': 'query',
                    'description': 'tags to filter by',
                    'type': 'string'
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
      });
      it('should return no errors for a valid OpenAPI 3 definition', () => {
        const spec = {
          openapi: '3.0.0',
          'paths': {
            '/pets': {
              'get': {
                'parameters': [
                  {
                    'name': 'wags',
                    'in': 'query',
                    'description': 'wags to filter by',
                    'type': 'string'
                  },
                  {
                    'name': 'tags',
                    'in': 'query',
                    'description': 'tags to filter by',
                    'type': 'string'
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
      });
    });
    describe('inherited siblings', () => {
      it(
        'should return no errors for a valid Swagger 2 definition due to inheritance',
        () => {
          const spec = {
            swagger: '2.0',
            parameters: {
              MyParam: {
                name: 'one',
                in: 'query'
              }
            },
            'paths': {
              '/pets': {
                'parameters': [
                  {
                    name: 'one',
                    in: 'query'
                  },
                  {
                    name: 'two',
                    in: 'query'
                  }
                ],
                'get': {
                  'parameters': [
                    {
                      name: 'two',
                      in: 'query'
                    },
                    {
                      name: 'three',
                      in: 'query'
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
        'should return no errors for a valid OpenAPI 3 definition due to inheritance',
        () => {
          const spec = {
            openapi: '3.0.0',
            parameters: {
              MyParam: {
                name: 'one',
                in: 'query'
              }
            },
            'paths': {
              '/pets': {
                'parameters': [
                  {
                    name: 'one',
                    in: 'query'
                  },
                  {
                    name: 'two',
                    in: 'query'
                  }
                ],
                'get': {
                  'parameters': [
                    {
                      name: 'two',
                      in: 'query'
                    },
                    {
                      name: 'three',
                      in: 'query'
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
      it('should not return an error for root parameters in Swagger 2', () => {
        const spec = {
          swagger: '2.0',
          parameters: {
            MyParam: {
              name: 'one',
              in: 'query'
            }
          },
          'paths': {
            '/pets': {
              'parameters': [
                {
                  name: 'otherParam',
                  in: 'query'
                }
              ],
              'get': {
                'parameters': [
                  {
                    name: 'one',
                    in: 'query'
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
      });
      it('should not return an error for root parameters in OpenAPI 3', () => {
        const spec = {
          openapi: '3.0.0',
          parameters: {
            MyParam: {
              name: 'one',
              in: 'query'
            }
          },
          'paths': {
            '/pets': {
              'parameters': [
                {
                  name: 'otherParam',
                  in: 'query'
                }
              ],
              'get': {
                'parameters': [
                  {
                    name: 'one',
                    in: 'query'
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
      });
      it('should return no errors for a valid Swagger 2 definition', () => {
        const spec = {
          swagger: '2.0',
          parameters: {
            MyParamOne: {
              name: 'one',
              in: 'query'
            },
            MyParamTwo: {
              name: 'anotherParam1',
              in: 'query'
            },
          },
          'paths': {
            '/pets/{one}/{two}': {
              'parameters': [
                {
                  name: 'one',
                  in: 'path',
                  required: true
                },
                {
                  name: 'two',
                  in: 'query'
                },
                {
                  name: 'anotherParam2',
                  in: 'query'
                },
              ],
              'get': {
                'parameters': [
                  {
                    name: 'two',
                    in: 'path',
                    required: true
                  },
                  {
                    name: 'three',
                    in: 'query'
                  },
                  {
                    name: 'anotherParam3',
                    in: 'query'
                  },
                ]
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors).toEqual([]);
          });
      });
      it('should return no errors for a valid OpenAPI 3 definition', () => {
        const spec = {
          openapi: '3.0.0',
          parameters: {
            MyParamOne: {
              name: 'one',
              in: 'query'
            },
            MyParamTwo: {
              name: 'anotherParam1',
              in: 'query'
            },
          },
          'paths': {
            '/pets/{one}/{two}': {
              'parameters': [
                {
                  name: 'one',
                  in: 'path',
                  required: true
                },
                {
                  name: 'two',
                  in: 'query'
                },
                {
                  name: 'anotherParam2',
                  in: 'query'
                },
              ],
              'get': {
                'parameters': [
                  {
                    name: 'two',
                    in: 'path',
                    required: true
                  },
                  {
                    name: 'three',
                    in: 'query'
                  },
                  {
                    name: 'anotherParam3',
                    in: 'query'
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
      });
    });

  });
  describe('parameter defaults must be present in enums', () => {
    it('should return an error for an invalid Swagger 2 definition', () => {
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
    });
    it('should return an error for an invalid OpenAPI 3 definition', () => {
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
    });
    it('should return an error for an invalid OpenAPI 3 definition', () => {
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
    });
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

  describe('path parameters must be in path definition', () => {
    it('should return no errors for a valid Swagger 2 definition', () => {
      const spec = {
        swagger: '2.0',
        info: {
          'title': 'Correct path parameters in path',
          'version': '1.0.0'
        },
        'paths': {
          '/foo/{param1}/{param2}/{param3}': {
            'parameters': [
              {
                name: 'param1',
                in: 'path',
                required: true,
                type: 'string'
              }, 
              {
                $ref: '#/parameters/param3'
              }
            ],
            'get': {
              'parameters': [
                {
                  name: 'param2',
                  in: 'path',
                  required: true,
                  type: 'string'
                }
              ],
              responses: {
                '200': {
                  'description': 'ok'
                }
              }
            }
          }
        },
        parameters: {
          param3: {
            name: 'param3',
            in: 'path',
            required: true,
            type: 'string'
          }
        }
      };

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(0);
        });
    });

    it(
      'should return 2 errors for each path parameter that isn\'t in the path in spec 2',
      () => {
        const spec = {
          swagger: '2.0',
          info: {
            'title': 'Unused path parameters in path',
            'version': '1.0.0'
          },
          'paths': {
            '/foo': {
              'parameters': [
                {
                  name: 'param1',
                  in: 'path',
                  required: true,
                  type: 'string'
                }
              ],
              'get': {
                'parameters': [
                  {
                    name: 'param2',
                    in: 'path',
                    required: true,
                    type: 'string'
                  }
                ],
                responses: {
                  '200': {
                    'description': 'ok'
                  }
                }
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(2);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['paths', '/foo', 'parameters', '0','name']);
            expect(firstError.message).toEqual('Path parameter "param1" must have the corresponding {param1} segment in the "/foo" path');
            const secondError = allErrors[1];
            expect(secondError.path).toEqual(['paths', '/foo', 'get', 'parameters', '0','name']);
            expect(secondError.message).toEqual('Path parameter "param2" must have the corresponding {param2} segment in the "/foo" path');
          });
      }
    );

    it(
      'should return 2 errors for each referenced path parameter that isn\'t in the path for 2 spec',
      () => {
        const spec = {
          swagger: '2.0',
          info: {
            'title': 'Unused path parameters in path',
            'version': '1.0.0'
          },
          'paths': {
            '/foo/{param1}/{param2}': {
              'parameters': [
                {
                  name: 'param1',
                  in: 'path',
                  required: true,
                  type: 'string'
                }, 
                {
                  $ref: '#/parameters/param3'
                }
              ],
              'get': {
                'parameters': [
                  {
                    name: 'param2',
                    in: 'path',
                    required: true,
                    type: 'string'
                  }, 
                  {
                    $ref: '#/parameters/param4'
                  }
                ],
                responses: {
                  '200': {
                    'description': 'ok'
                  }
                }
              }
            }
          },
          parameters: {
            param3: {
              name: 'param3',
              in: 'path',
              required: true,
              type: 'string'
            },
            param4: {
              name: 'param4',
              in: 'path',
              required: true,
              type: 'string'
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(2);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['paths', '/foo/{param1}/{param2}', 'parameters', '1','name']);
            expect(firstError.message).toEqual('Path parameter "param3" must have the corresponding {param3} segment in the "/foo/{param1}/{param2}" path');
            const secondError = allErrors[1];
            expect(secondError.path).toEqual(['paths', '/foo/{param1}/{param2}','get', 'parameters', '1','name']);
            expect(secondError.message).toEqual('Path parameter "param4" must have the corresponding {param4} segment in the "/foo/{param1}/{param2}" path');
          });
      }
    );

    it('should return no errors for a valid Swagger 3 definition', () => {
      const spec = {
        swagger: '3.0',
        info: {
          'title': 'Correct path parameters in path',
          'version': '1.0.0'
        },
        'paths': {
          '/foo/{param1}/{param2}/{param3}': {
            'parameters': [
              {
                name: 'param1',
                in: 'path',
                required: true,
                type: 'string'
              }, 
              {
                $ref: '#/parameters/param3'
              }
            ],
            'get': {
              'parameters': [
                {
                  name: 'param2',
                  in: 'path',
                  required: true,
                  type: 'string'
                }
              ],
              responses: {
                '200': {
                  'description': 'ok'
                }
              }
            }
          }
        },
        components: {
          parameters: {
            param3: {
              name: 'param3',
              in: 'path',
              required: true,
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
    });

    it(
      'should return 2 errors for each path parameter that isn\'t in the path in spec 3',
      () => {
        const spec = {
          openapi: '3.0.2',
          info: {
            'title': 'Unused path parameters in path',
            'version': '1.0.0'
          },
          'paths': {
            '/foo': {
              'parameters': [
                {
                  name: 'param1',
                  in: 'path',
                  required: true,
                  type: 'string'
                }
              ],
              'get': {
                'parameters': [
                  {
                    name: 'param2',
                    in: 'path',
                    required: true,
                    type: 'string'
                  }
                ],
                responses: {
                  '200': {
                    'description': 'ok'
                  }
                }
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(2);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['paths', '/foo', 'parameters', '0','name']);
            expect(firstError.message).toEqual('Path parameter "param1" must have the corresponding {param1} segment in the "/foo" path');
            const secondError = allErrors[1];
            expect(secondError.path).toEqual(['paths', '/foo', 'get', 'parameters', '0','name']);
            expect(secondError.message).toEqual('Path parameter "param2" must have the corresponding {param2} segment in the "/foo" path');
          });
      }
    );

    it(
      'should return 2 errors for each referenced path parameter that isn\'t in the path for 3 spec',
      () => {
        const spec = {
          openapi: '3.0.2',
          info: {
            'title': 'Unused path parameters in path',
            'version': '1.0.0'
          },
          'paths': {
            '/foo/{param1}/{param2}': {
              'parameters': [
                {
                  name: 'param1',
                  in: 'path',
                  required: true,
                  type: 'string'
                }, 
                {
                  $ref: '#/components/parameters/param3'
                }
              ],
              'get': {
                'parameters': [
                  {
                    name: 'param2',
                    in: 'path',
                    required: true,
                    type: 'string'
                  }, 
                  {
                    $ref: '#/components/parameters/param4'
                  }
                ],
                responses: {
                  '200': {
                    'description': 'ok'
                  }
                }
              }
            }
          },
          components: {
            parameters: {
              param3: {
                name: 'param3',
                in: 'path',
                required: true,
                type: 'string'
              },
              param4: {
                name: 'param4',
                in: 'path',
                required: true,
                type: 'string'
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(2);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['paths', '/foo/{param1}/{param2}', 'parameters', '1','name']);
            expect(firstError.message).toEqual('Path parameter "param3" must have the corresponding {param3} segment in the "/foo/{param1}/{param2}" path');
            const secondError = allErrors[1];
            expect(secondError.path).toEqual(['paths', '/foo/{param1}/{param2}','get', 'parameters', '1','name']);
            expect(secondError.message).toEqual('Path parameter "param4" must have the corresponding {param4} segment in the "/foo/{param1}/{param2}" path');
          });
      }
    );
  });
});