
import validateHelper, { expectNoErrorsOrWarnings } from '../validate-helper.js';

describe('validation plugin - semantic - oas3 parameters', () => {
  describe('Header parameters should not be named Authorization, Content-Type, or Accept', () => {
    it(
      'should return a warning when a header parameter named Authorization is defined in an operation',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              get: {
                parameters: [
                  {
                    in: 'header',
                    name: 'authorization'
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
            expect(firstError.message).toMatch('Header parameters named "Authorization" are ignored.');
            expect(firstError.path).toEqual(['paths', '/', 'get', 'parameters', '0', 'name']);
          });
      }
    );
    it(
      'should return a warning when a header parameter named Content-Type is defined in an operation',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              get: {
                parameters: [
                  {
                    in: 'header',
                    name: 'content-type'
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
            expect(firstError.message).toMatch('Header parameters named "Content-Type" are ignored.');
            expect(firstError.path).toEqual(['paths', '/', 'get', 'parameters', '0', 'name']);
          });
      }
    );
    it(
      'should return a warning when a header parameter named Accept is defined in an operation',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              get: {
                parameters: [
                  {
                    in: 'header',
                    name: 'accept'
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
            expect(firstError.message).toMatch('Header parameters named "Accept" are ignored.');
            expect(firstError.path).toEqual(['paths', '/', 'get', 'parameters', '0', 'name']);
          });
      }
    );
    it(
      'should return a warning when a header parameter named Authorization is defined in components',
      () => {
        const spec = {
          openapi: '3.0.0',
          components: {
            parameters: {
              auth: {
                in: 'header',
                name: 'authorization'
              }
            }
          }
        };

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.message).toMatch('Header parameters named "Authorization" are ignored.');
            expect(firstError.path).toEqual(['components', 'parameters', 'auth', 'name']);
          });
      }
    );
    it(
      'should return no warnings when a non-header parameter is named Authorization',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              get: {
                parameters: [
                  {
                    in: 'query',
                    name: 'authorization'
                  }
                ]
              }
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );
    it(
      'should return no warnings when a header parameter name contains \'Authorization\' as a substring',
      () => {
        const spec = {
          openapi: '3.0.0',
          paths: {
            '/': {
              get: {
                parameters: [
                  {
                    in: 'header',
                    name: 'X-Authorization'
                  }
                ]
              }
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );
    it(
      'should return no warnings when a header parameter is named \'Authorization\' in OpenAPI 2.0',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/': {
              get: {
                parameters: [
                  {
                    in: 'header',
                    name: 'authorization'
                  }
                ]
              }
            }
          }
        };

        return expectNoErrorsOrWarnings(spec);
      }
    );
  });
});
