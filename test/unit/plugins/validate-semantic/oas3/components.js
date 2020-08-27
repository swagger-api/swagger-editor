
import validateHelper, { expectNoErrors } from '../validate-helper.js';

describe('validation plugin - semantic - oas3 components', () => {
  describe('OAS3 component names must consist of allowed characters', () => {
    it(
      'should return an error when OAS3 component names contain forbidden characters',
      () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              'Foo«Bar»': {}
            },
            parameters: {
              'Foo«Bar»': {
                in: 'query',
                name: 'foo',
                schema: {
                  type: 'string'
                }
              }
            },
            responses: {
              'Foo«Bar»': {
                description: 'ok'
              }
            },
            examples: {
              'Foo«Bar»': {
                value: 1
              }
            },
            requestBodies: {
              'Foo«Bar»': {
                content: {
                  'text/plain': {}
                }
              }
            },
            headers: {
              'Foo«Bar»': {
                schema: {
                  type: 'string'
                }
              }
            },
            securitySchemes: {
              'Foo«Bar»': {
                type: 'http',
                scheme: 'basic'
              }
            },
            callbacks: {
              'Foo«Bar»': {
                '{$request.body#/callbackUrl}': {}
              }
            },
            links: {
              'Foo«Bar»': {
                operationId: 'getUser'
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            // We want errors only, without "unused definition" warnings
            const allErrors = system.errSelectors.allErrors().toJS()
              .filter(err => err.level === 'error');

            const errorMessage = 'Component names can only contain the characters A-Z a-z 0-9 - . _';

            expect(allErrors.length).toEqual(9);
            expect(allErrors[0]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'schemas', 'Foo«Bar»']
            }));
            expect(allErrors[1]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'parameters', 'Foo«Bar»']
            }));
            expect(allErrors[2]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'responses', 'Foo«Bar»']
            }));
            expect(allErrors[3]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'examples', 'Foo«Bar»']
            }));
            expect(allErrors[4]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'requestBodies', 'Foo«Bar»']
            }));
            expect(allErrors[5]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'headers', 'Foo«Bar»']
            }));
            expect(allErrors[6]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'securitySchemes', 'Foo«Bar»']
            }));
            expect(allErrors[7]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'callbacks', 'Foo«Bar»']
            }));
            expect(allErrors[8]).toEqual(expect.objectContaining({
              level: 'error',
              message: errorMessage,
              path: ['components', 'links', 'Foo«Bar»']
            }));
          });
      }
    );

    it(
      'should not return errors when OAS3 component names consist of allowed characters',
      () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            schemas: {
              'A-a.0_': {}
            },
            parameters: {
              'B-b.1_': {
                in: 'query',
                name: 'foo',
                schema: {
                  type: 'string'
                }
              }
            },
            responses: {
              'C-c.3_': {
                description: 'ok'
              }
            },
            examples: {
              'D-d.4_': {
                value: 1
              }
            },
            requestBodies: {
              'E-e.5_': {
                content: {
                  'test/plain': {}
                }
              }
            },
            headers: {
              'F-f.6_': {
                schema: {
                  type: 'string'
                }
              }
            },
            securitySchemes: {
              'G-g.7_': {
                type: 'http',
                scheme: 'basic'
              }
            },
            callbacks: {
              'H-h.8_': {
                '{$request.body#/callbackUrl}': {}
              }
            },
            links: {
              'I-i.9_': {
                operationId: 'getUser'
              }
            }
          }
        };

        return expectNoErrors(spec);
      }
    );

    it(
      'should not return errors when an x- extension key contains special characters',
      () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            'x-foo«bar»': {
               'key with spaces': 42
            }
          }
        };

        return expectNoErrors(spec);
      }
    );

    it(
      'should not return errors when OAS2 component names contain special characters',
      () => {
        const spec = {
          swagger: '2.0',
          definitions: {
            'Foo«Bar»': {
              type: 'object'
            }
          },
          parameters: {
            'Foo«Bar»': {
              in: 'query',
              name: 'foo',
              type: 'string'
            }
          },
          responses: {
            'Foo«Bar»': {
              description: 'ok'
            }
          },
          securityDefinitions: {
            'Foo«Bar»': {
              type: 'basic'
            }
          }
        };

        return expectNoErrors(spec);
      }
    );
  });
});
