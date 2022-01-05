import validateHelper, { expectNoErrors } from '../validate-helper.js';

describe('validation plugin - semantic - oas3 schemas', () => {
  describe('schema properties that contain both readOnly and writeOnly', () => {
    it('should return an error if both readOnly/writeOnly exist and are both values are true', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'readOnly': true,
                  'writeOnly': true
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.message).toEqual('A property MUST NOT be marked as both \'readOnly\' and \'writeOnly\' being \'true\'');
          expect(firstError.path).toEqual(['components', 'schemas', 'PropertyToTest', 'properties', 'id']);
        });
    });

    it('should not return an error if oneOf readOnly/writeOnly value is a string', () => {
      // Note: this spec should return parser error that 'writeOnly' should be a boolean, 
      // but should not return a validation-plugin error. e.g true != 'true'
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'readOnly': true,
                  'writeOnly': 'true' // <-- not boolean
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });

    it('should not return an error if both readOnly/writeOnly values are false', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'readOnly': false,
                  'writeOnly': false
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });
    
    it('should not return an error if readOnly value is true and writeOnly value is false', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'readOnly': true,
                  'writeOnly': false
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });

    it('should not return an error if readOnly value is false and writeOnly value is true', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'readOnly': false,
                  'writeOnly': true
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });
  });

  describe('schema properties that contain only oneOf readOnly/writeOnly', () => {
    it('should not return an error if only readOnly exists and value is true', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'readOnly': true,
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });
  
    it('should not return an error if only readOnly exists and value is false', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'readOnly': false,
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });
  
    it('should not return an error if only writeOnly exists and value is true', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'writeOnly': false
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });
  
    it('should not return an error if only writeOnly exists and value is false', () => {
      const spec = {
        'openapi': '3.0.0',
        'servers': [
          {
            'description': '',
            'url': ''
          }
        ],
        'info': {
          'version': '1.0.0',
          'title': 'Test Schema Properties'
        },
        'paths': {
          '/': {
            'post': {
              'responses': {
                '200': {
                  'description': 'response ok'
                }
              },
              'requestBody': {
                'content': {
                  'application/json': {
                    'schema': {
                      '$ref': '#/components/schemas/PropertyToTest'
                    }
                  }
                }
              }
            }
          }
        },
        'components': {
          'schemas': {
            'PropertyToTest': {
              'type': 'object',
              'required': [
                'id',
                'fieldname',
                'fieldDate'
              ],
              'properties': {
                'id': {
                  'type': 'string',
                  'format': 'uuid',
                  'writeOnly': true
                },
                'fieldname': {
                  'type': 'string'
                },
                'fieldDate': {
                  'type': 'string',
                  'format': 'date-time'
                }
              }
            }
          }
        }
      };
      return expectNoErrors(spec);
    });

  });


});
