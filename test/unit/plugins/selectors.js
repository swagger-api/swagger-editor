import SwaggerUI from 'swagger-ui';
import ValidateBasePlugin from 'plugins/validate-base';
import ValidateSemanticPlugin from 'plugins/validate-semantic';
import ASTPlugin from 'plugins/ast';

function getSystem(spec) {
  return new Promise((resolve) => {
    const system = SwaggerUI({
      spec,
      domNode: null,
      presets: [
        SwaggerUI.plugins.SpecIndex,
        SwaggerUI.plugins.ErrIndex,
        SwaggerUI.plugins.DownloadUrl,
        SwaggerUI.plugins.SwaggerJsIndex,
        SwaggerUI.plugins.RequestSnippetsIndex,
      ],
      initialState: {
        layout: undefined
      },
      plugins: [
        ASTPlugin,
        ValidateBasePlugin,
        ValidateSemanticPlugin,
        () => ({
          statePlugins: {
            configs: {
              actions: {
                loaded: () => {
                  return {
                    type: 'noop'
                  };
                }
              }
            }
          }
        })
      ]
    });
    resolve(system);
  });
}

describe('validation plugin - selectors', () => {

  describe('allSchemas', () => {
    describe('OpenAPI 2.0', () => {
      it('should pick up parameter schemas', () => {
        const spec = {
          paths: {
            test: {
              parameters: [{
                name: 'common'
              }],
              get: {
                parameters: [{
                  name: 'tags'
                }]
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].path).toEqual(['paths','test','parameters','0']);
            expect(nodes[1].path).toEqual(['paths','test','get','parameters','0']);
          });
      });

      it('should pick up response schemas', () => {
        const spec = {
          paths: {
            test: {
              get: {
                responses: {
                  '200': {
                    schema: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(1);
            expect(nodes[0].path.join('.')).toEqual('paths.test.get.responses.200.schema');
          });
      });

      it('should pick up global definitions', () => {
        const spec = {
          definitions: {
            fooModel: {
              type: 'object',
              properties: {
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(1);
            expect(nodes[0].key).toEqual('fooModel');
          });
      });

      it(
        'should pick up global definitions named \'x-\' (i.e. not consider them extensions)',
        () => {
          const spec = {
            definitions: {
              'x-fooModel': {
                type: 'string'
              }
            }
          };

          return getSystem(spec)
            .then(system => system.validateSelectors.allSchemas())
            .then(nodes => {
              expect(nodes.length).toEqual(1);
              expect(nodes[0].key).toEqual('x-fooModel');
            });
        }
      );

      it('should pick up response headers', () => {
        const spec = {
          paths: {
            test: {
              get: {
                responses: {
                  '200': {
                    headers: {
                      foo: {
                        'type': 'integer'
                      }
                    }
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(1);
            expect(nodes[0].path.join('.')).toEqual('paths.test.get.responses.200.headers.foo');
          });
      });

      it('should pick up subschemas in properties', () => {
        const spec = {
          definitions: {
            fooModel: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string'
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('foo');
          });
      });

      it('should pick up subschemas in additionalProperties - simple', () => {
        const spec = {
          definitions: {
            fooModel: {
              type: 'object',
              additionalProperties: {
                type: 'string'
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('additionalProperties');
          });
      });

      it('should pick up subschemas in additionalProperties - complex', () => {
        const spec = {
          definitions: {
            fooModel: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(3);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('additionalProperties');
            expect(nodes[2].key).toEqual('foo');
          });
      });

      it('should pick up subschemas in array', () => {
        const spec = {
          definitions: {
            fooModel: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('items');
          });
      });

      it('should pick up subschemas in array of objects', () => {
        const spec = {
          definitions: {
            fooModel: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(3);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('items');
            expect(nodes[2].key).toEqual('foo');
          });
      });
    });

    describe('OpenAPI 3.0', () => {
      it('should pick up schemas in \'components\'', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              fooModel: {
                type: 'string'
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(1);
            expect(nodes[0].key).toEqual('fooModel');
          });
      });

      it(
        'should pick up schemas named \'x-\' (i.e. not consider them extensions)',
        () => {
          const spec = {
            openapi: '3.0.0',
            components: {
              schemas: {
                'x-fooModel': {
                  type: 'string'
                }
              }
            }
          };

          return getSystem(spec)
            .then(system => system.validateSelectors.allSchemas())
            .then(nodes => {
              expect(nodes.length).toEqual(1);
              expect(nodes[0].key).toEqual('x-fooModel');
            });
        }
      );

      it('should pick up request body schemas and response schemas', () => {
        const spec = {
          'openapi': '3.0.0',
          'paths': {
            '/ping': {
              'post': {
                'requestBody': {
                  'content': {
                    'application/myRequestMediaType': {
                      'schema': {
                        'type': 'array'
                      }
                    }
                  }
                },
                'responses': {
                  '200': {
                    'description': 'OK',
                    'content': {
                      'application/myResponseMediaType': {
                        'schema': {
                          'type': 'string'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].node).not.toBe(nodes[1].node);
            expect(nodes[0].key).toEqual('schema');
            expect(nodes[0].parent.key).toEqual('application/myRequestMediaType');
            expect(nodes[1].key).toEqual('schema');
            expect(nodes[1].parent.key).toEqual('application/myResponseMediaType');
          });
      });

      it('should pick up schemas in response components', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            responses: {
              MyResponse: {
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

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(1);
            expect(nodes[0].path).toEqual(['components','responses','MyResponse','content','application/json','schema']);
          });
      });

      it('should pick up subschemas in properties', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              fooModel: {
                type: 'object',
                properties: {
                  foo: {
                    type: 'string'
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('foo');
          });
      });

      it('should pick up subschemas in additionalProperties - simple', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              fooModel: {
                type: 'object',
                additionalProperties: {
                  type: 'string'
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('additionalProperties');
          });
      });

      it('should pick up subschemas in additionalProperties - complex', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              fooModel: {
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(3);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('additionalProperties');
            expect(nodes[2].key).toEqual('foo');
          });
      });

      it('should pick up subschemas in array', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              fooModel: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(2);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('items');
          });
      });

      it('should pick up subschemas in array of objects', () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              fooModel: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSchemas())
          .then(nodes => {
            expect(nodes.length).toEqual(3);
            expect(nodes[0].key).toEqual('fooModel');
            expect(nodes[1].key).toEqual('items');
            expect(nodes[2].key).toEqual('foo');
          });
      });
    });
  });

  describe('allResponses', () => {
    it('should pick up operation responses with specific codes like 200', () => {
      const spec = {
        paths: {
          '/foo': {
            get: {
              responses: {
                '200': {
                  description: 'ok'
                }
              }
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allResponses())
        .then(nodes => {
          expect(nodes.length).toEqual(1);
          expect(nodes[0].path).toEqual(['paths','/foo','get','responses','200']);
        });
    });
    it('should pick up the \'default\' response', () => {
      const spec = {
        paths: {
          '/foo': {
            get: {
              responses: {
                default: {
                  description: 'ok'
                }
              }
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allResponses())
        .then(nodes => {
          expect(nodes.length).toEqual(1);
          expect(nodes[0].path).toEqual(['paths','/foo','get','responses','default']);
        });
    });
    it('should pick up OAS3 response code ranges like 2XX', () => {
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/foo': {
            get: {
              responses: {
                '2XX': {
                  description: 'ok'
                }
              }
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allResponses())
        .then(nodes => {
          expect(nodes.length).toEqual(1);
          expect(nodes[0].path).toEqual(['paths','/foo','get','responses','2XX']);
        });
    });
    it(
      'should ignore x- extension keys in an operation\'s `responses` section',
      () => {
        const spec = {
          paths: {
            '/foo': {
              get: {
                responses: {
                  'x-ext': {
                    foo: 'bar'
                  }
                }
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allResponses())
          .then(nodes => {
            expect(nodes.length).toEqual(0);
          });
      }
    );
    it('should pick up OpenAPI 2 global response definitions', () => {
      const spec = {
        swagger: '2.0',
        responses: {
          OkResponse: {
            description: 'ok'
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allResponses())
        .then(nodes => {
          expect(nodes.length).toEqual(1);
          expect(nodes[0].path).toEqual(['responses','OkResponse']);
        });
    });
    it('should pick up OpenAPI 2 response definitions named \'x-\'', () => {
      const spec = {
        swagger: '2.0',
        responses: {
          'x-MyResponse': {
            description: 'ok'
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allResponses())
        .then(nodes => {
          expect(nodes.length).toEqual(1);
          expect(nodes[0].path).toEqual(['responses','x-MyResponse']);
        });
    });
    it('should pick up OpenAPI 3 response components', () => {
      const spec = {
        openapi: '3.0.0',
        components : {
          responses: {
            OkResponse: {
              description: 'ok'
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allResponses())
        .then(nodes => {
          expect(nodes.length).toEqual(1);
          expect(nodes[0].path).toEqual(['components','responses','OkResponse']);
        });
    });
    it('should pick up OpenAPI 3 response components named \'x-\'', () => {
      const spec = {
        openapi: '3.0.0',
        components : {
          responses: {
            'x-MyResponse': {
              description: 'ok'
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allResponses())
        .then(nodes => {
          expect(nodes.length).toEqual(1);
          expect(nodes[0].path).toEqual(['components','responses','x-MyResponse']);
        });
    });
  });

  describe('allSecurityDefinitions', () => {
    it('should pick up OAS2 security schemes', () => {
      const spec = {
        swagger: '2.0',
        securityDefinitions: {
          basicAuth: {
            type: 'basic'
          },
          apiKeyAuth: {
            type: 'apiKey'
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allSecurityDefinitions())
        .then(nodes => {
          expect(nodes.length).toEqual(2);
          expect(nodes[0].node).not.toBe(nodes[1].node);
          expect(nodes[0].key).toEqual('basicAuth');
          expect(nodes[1].key).toEqual('apiKeyAuth');
        });
    });
    it('should pick up OAS3 security schemes', () => {
      const spec = {
        openapi: '3.0.0',
        components: {
          securitySchemes: {
            basicAuth: {
              type: 'http'
            },
            apiKeyAuth: {
              type: 'apiKey'
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allSecurityDefinitions())
        .then(nodes => {
          expect(nodes.length).toEqual(2);
          expect(nodes[0].node).not.toBe(nodes[1].node);
          expect(nodes[0].key).toEqual('basicAuth');
          expect(nodes[1].key).toEqual('apiKeyAuth');
        });
    });
    it(
      'should pick up OAS2 security schemes named x- (i.e. not consider them extensions)',
      () => {
        const spec = {
          swagger: '2.0',
          securityDefinitions: {
            'x-auth': {
              type: 'basic'
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSecurityDefinitions())
          .then(nodes => {
            expect(nodes.length).toEqual(1);
            expect(nodes[0].key).toEqual('x-auth');
          });
      }
    );
    it(
      'should pick up OAS3 security schemes named x- (i.e. not consider them extensions)',
      () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            securitySchemes: {
              'x-auth': {
                type: 'basic'
              }
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSecurityDefinitions())
          .then(nodes => {
            expect(nodes.length).toEqual(1);
            expect(nodes[0].key).toEqual('x-auth');
          });
      }
    );
    it(
      'should not pick up arbitrary OAS2 nodes named `securityDefinitions`',
      () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            securityDefinitions: {
              type: 'object'
            }
          }
        };

        return getSystem(spec)
          .then(system => system.validateSelectors.allSecurityDefinitions())
          .then(nodes => {
            expect(nodes.length).toEqual(0);
          });
      }
    );
    it('should not pick up arbitrary OAS3 nodes named `securitySchemes`', () => {
      const spec = {
        openapi: '3.0.0',
        components: {
          schemas: {
            securitySchemes: {
              type: 'object'
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allSecurityDefinitions())
        .then(nodes => {
          expect(nodes.length).toEqual(0);
        });
    });
  });

  describe('allSecurityRequirements', () => {
    it('should pick up global security requirements', () => {
      const spec = {
        security: [
          {
            auth1: []
          },
          {
            auth2: [],
            auth3: []
          }
        ]
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allSecurityRequirements())
        .then(nodes => {
          expect(nodes.length).toEqual(2);
          expect(nodes[0].node).not.toBe(nodes[1].node);
          expect(nodes[0].node).toEqual(
            { 'auth1': [] }
          );
          expect(nodes[1].node).toEqual(
            { 'auth2': [], 'auth3': [] }
          );
        });
    });
    it('should pick up operation-level security requirements', () => {
      const spec = {
        paths: {
          '/': {
            get: {
              security: [
                {
                  auth1: []
                },
                {
                  auth2: [],
                  auth3: []
                }
              ]
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allSecurityRequirements())
        .then(nodes => {
          expect(nodes.length).toEqual(2);
          expect(nodes[0].node).not.toBe(nodes[1].node);
          expect(nodes[0].node).toEqual(
            { 'auth1': [] }
          );
          expect(nodes[1].node).toEqual(
            { 'auth2': [], 'auth3': [] }
          );
        });
    });
    it('should pick up empty security requirements', () => {
      const spec = {
        security: [
          {}
        ],
        paths: {
          '/': {
            get: {
              security: [
                {}
              ]
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allSecurityRequirements())
        .then(nodes => {
          expect(nodes.length).toEqual(2);
          expect(nodes[0].node).not.toBe(nodes[1].node);
          expect(nodes[0].node).toEqual({});
          expect(nodes[1].node).toEqual({});
        });
    });
    it('should not pick up the `security` key inside extensions', () => {
      const spec = {
        paths: {
          '/': {
            'x-ext1': {
              security: [
                { foo: [] }
              ]
            }
          },
          'x-ext2': {
            get: {
              security: [
                { bar: [] }
              ]
            }
          }
        }
      };

      return getSystem(spec)
        .then(system => system.validateSelectors.allSecurityRequirements())
        .then(nodes => {
          expect(nodes.length).toEqual(0);
        });
    });
  });
});
