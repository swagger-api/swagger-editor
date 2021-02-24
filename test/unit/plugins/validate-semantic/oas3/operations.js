
import validateHelper, { expectNoErrors } from '../validate-helper.js';

describe('validation plugin - semantic - oas3 operations', () => {
  describe('GET and DELETE operations may not have a requestBody', () => {
    it(
      'should return an error when a requestBody exists in a GET operation',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              get: {
                operationId: 'myId',
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

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.message).toEqual('GET operations cannot have a requestBody.');
            expect(firstError.path).toEqual(['paths', '/', 'get', 'requestBody']);
          });
      }
    );
    it(
      'should return an error when a requestBody exists in a DELETE operation',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              delete: {
                operationId: 'myId',
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

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.message).toEqual('DELETE operations cannot have a requestBody.');
            expect(firstError.path).toEqual(['paths', '/', 'delete', 'requestBody']);
          });
      }
    );
    it(
      'should not return an error when other methods contain a requestBody',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              post: {
                operationId: 'myId',
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

        return expectNoErrors(spec);
      }
    );
  });
});
