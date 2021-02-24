
import validateHelper, { expectNoErrorsOrWarnings } from '../validate-helper.js';

describe('validation plugin - semantic - 2and3 security', () => {
  it(
    'should return an error when top-level security references a non-existing security scheme',
    () => {
      const spec = {
        swagger: '2.0',
        security: [
          {
            'fictional_security_definition': [
              'write:pets'
            ]
          }
        ]
      };

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.path).toEqual(['security', '0']);
          expect(firstError.message).toMatch('Security requirements must match a security definition');
        });
    }
  );

  it(
    'should return an error when an operation references a non-existing security scheme',
    () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/': {
            get: {
              security: [
                {
                  'fictional_security_definition': [
                    'write:pets'
                  ]
                }
              ]
            }
          }
        }
      };

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          expect(allErrors.length).toEqual(1);
          const firstError = allErrors[0];
          expect(firstError.path).toEqual(['paths', '/', 'get', 'security', '0']);
          expect(firstError.message).toMatch('Security requirements must match a security definition');
        });
    }
  );

  it(
    'should return a warning when a security scheme is defined but not used in OpenAPI 2.0',
    () => {
      const spec = {
        swagger: '2.0',
        securityDefinitions: {
          auth: {
            type: 'basic'
          }
        }
      };

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.level).toEqual('warning');
          expect(firstError.message).toMatch('Security scheme was defined but never used.');
          expect(firstError.path).toEqual(['securityDefinitions', 'auth']);
        });
    }
  );

  it(
    'should return a warning when a security scheme is defined but not used in OpenAPI 3.0',
    () => {
      const spec = {
        openapi: '3.0.0',
        components: {
          securitySchemes: {
            auth: {
              type: 'http'
            }
          }
        }
      };

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.level).toEqual('warning');
          expect(firstError.message).toMatch('Security scheme was defined but never used.');
          expect(firstError.path).toEqual(['components', 'securitySchemes', 'auth']);
        });
    }
  );

  it(
    'should return no errors when a security scheme is defined and referenced globally in OpenAPI 2.0',
    () => {
      const spec = {
        swagger: '2.0',
        security: [
          { auth: [] }
        ],
        securityDefinitions: {
          auth: {
            type: 'basic'
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );

  it(
    'should return no errors when a security scheme is defined and used in an operation in OpenAPI 2.0',
    () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/': {
            get: {
              security: [
                { auth: [] }
              ]
            }
          }
        },
        securityDefinitions: {
          auth: {
            type: 'basic'
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );

  it(
    'should return no errors when a security scheme is defined and referenced globally in OpenAPI 3.0',
    () => {
      const spec = {
        openapi: '3.0.0',
        security: [
          { auth: [] }
        ],
        components: {
          securitySchemes: {
            auth: {
              type: 'http'
            }
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );

  it(
    'should return no errors when a security scheme is defined and used in an operation in OpenAPI 3.0',
    () => {
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/': {
            get: {
              security: [
                { auth: [] }
              ]
            }
          }
        },
        components: {
          securitySchemes: {
            auth: {
              type: 'http'
            }
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );

  it(
    'should return no errrors when `security` contains multiple requirements combined using logical OR',
    () => {
      const spec = {
        swagger: '2.0',
        security: [
          {},
          { auth: [] }
        ],
        securityDefinitions: {
          auth: {
            type: 'basic'
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );

  it(
    'should return no errors when security schemes are combined using logical AND',
    () => {
      const spec = {
        swagger: '2.0',
        security: [
          {
            auth1: [],
            auth2: []
          }
        ],
        securityDefinitions: {
          auth1: {
            type: 'apiKey'
          },
          auth2: {
            type: 'apiKey'
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );
});