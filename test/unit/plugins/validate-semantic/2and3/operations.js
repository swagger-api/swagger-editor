
import validateHelper, { expectNoErrors } from '../validate-helper.js';

describe('validation plugin - semantic - 2and3 operations', () => {
  describe('Operations must have unique operationIds', () => {
    describe('OpenAPI 3.0', () => {
      it('should return an error when operationId collisions exist', () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              get: {
                operationId: 'myId'
              },
              post: {
                operationId: 'myId'
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.message).toEqual('Operations must have unique operationIds.');
            expect(firstError.path).toEqual(['paths', '/', 'post', 'operationId']);
          });
      });
      it(
        'should not return an error when operationId collisions don\'t exist',
        () => {
          const spec = {
            openapi: '3.0.0',
            paths: {
              '/': {
                get: {
                  operationId: 'myId1'
                },
                post: {
                  operationId: 'myId2'
                }
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
    });
    describe('Swagger 2.0', () => {
      it('should return an error when operationId collisions exist', () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/': {
              get: {
                operationId: 'myId'
              },
              post: {
                operationId: 'myId'
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.message).toEqual('Operations must have unique operationIds.');
            expect(firstError.path).toEqual(['paths', '/', 'post', 'operationId']);
          });
      });
      it(
        'should not return an error when operationId collisions don\'t exist',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/': {
                get: {
                  operationId: 'myId1'
                },
                post: {
                  operationId: 'myId2'
                }
              }
            }
          };

          return expectNoErrors(spec);
        }
      );
    });
  });
});
