import validateHelper, { expectNoErrors } from './validate-helper.js';

describe('validation plugin - semantic - parameters', () => {
  it(
    'should return an error when an array type parameter omits an `items` property',
    () => {
      const spec = {
        swagger: '2.0',
        'paths': {
          '/pets': {
            'get': {
              'parameters': [
                {
                  'name': 'tags',
                  'in': 'query',
                  'description': 'tags to filter by',
                  'type': 'array'
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
            expect(firstError.path).toEqual(['paths', '/pets', 'get', 'parameters', '0']);
            expect(firstError.message).toMatch(/.*type.*array.*require.*items/);
          });
    }
  );

  describe('Operations cannot have both a \'body\' parameter and a \'formData\' parameter', () => {
    it('should complain about having both in the same operation', () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/': {
            get: {
              consumes: ['multipart/form-data'],
              parameters: [
                { in: 'formData' },
                { in: 'body' },
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
          expect(firstError.message).toEqual('Parameters cannot have both a "in: body" and "in: formData", as "formData" _will_ be the body');
          expect(firstError.path).toEqual(['paths', '/', 'get', 'parameters']);
        });
    });
    it(
      'should not complain about having only a body parameter in the same operation',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/': {
              get: {
                consumes: ['multipart/form-data'],
                parameters: [
                  { in: 'body' },
                ]
              }
            }
          }
        };

        return expectNoErrors(spec);
      }
    );
    it(
      'should not complain about having only a formData parameter in the same operation',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/': {
              get: {
                consumes: ['multipart/form-data'],
                parameters: [
                  { in: 'formData' },
                ]
              }
            }
          }
        };

        return expectNoErrors(spec);
      }
    );
  });

    describe('Operations must have only one body parameter', () => {
      it(
        'should complain about having two body parameters in the same operation',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/': {
                get: {
                  consumes: ['multipart/form-data'],
                  parameters: [
                    { in: 'body' },
                    { in: 'body' },
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
              expect(firstError.message).toEqual('Multiple body parameters are not allowed.');
              expect(firstError.path).toEqual(['paths', '/', 'get', 'parameters']);
            });
        }
      );
      it(
        'should not complain about having one body parameter in the same operation',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/': {
                get: {
                  consumes: ['multipart/form-data'],
                  parameters: [
                    { in: 'body' }
                  ]
                }
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
    });
});
