
import validateHelper, { expectNoErrorsOrWarnings } from './validate-helper.js';

describe('validation plugin - semantic - security scopes', () => {
  it(
    'should return an error when an operation references a non-existing security scope',
    () => {
      const spec = {
        'swagger': '2.0',
        'securityDefinitions': {
          'api_key': {
            'type': 'apiKey',
            'name': 'apikey',
            'in': 'query',
            'scopes': {
              'asdf': 'blah blah'
            }
          }
        },
        'paths': {
          '/': {
            'get': {
              'description': 'asdf',
              'security': [
                {
                  'api_key': [
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
          expect(firstError.path).toEqual(['paths', '/', 'get', 'security', '0', '0']);
          expect(firstError.message).toEqual('Security scope definition write:pets could not be resolved');
        });
    }
  );

  it(
    'should return an error when an operation references a security definition with no scopes',
    () => {

      const spec = {
        'swagger': '2.0',
        'securityDefinitions': {
          'api_key': {
            'type': 'apiKey',
            'name': 'apikey',
            'in': 'query'
          }
        },
        'paths': {
          '/': {
            'get': {
              'description': 'asdf',
              'security': [
                {
                  'api_key': [
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
          expect(firstError.path).toEqual(['paths', '/', 'get', 'security', '0', '0']);
          expect(firstError.message).toMatch('Security scope definition write:pets could not be resolved');
        });
    }
  );

  it(
    'should not return an error when an operation references an existing security scope',
    () => {
      const spec = {
        'swagger': '2.0',
        'securityDefinitions': {
          'api_key': {
            'type': 'apiKey',
            'name': 'apikey',
            'in': 'query',
            'scopes': {
              'write:pets': 'write to pets'
            }
          }
        },
        'paths': {
          '/': {
            'get': {
              'description': 'asdf',
              'security': [
                {
                  'api_key': [
                    'write:pets'
                  ]
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
    'should not return an error when an top-level security references an existing security scope',
    () => {
      const spec = {
        'swagger': '2.0',
        'securityDefinitions': {
          'api_key': {
            'type': 'apiKey',
            'name': 'apikey',
            'in': 'query',
            'scopes': {
              'write:pets': ''
            }
          }
        },
        'security': [
          {
            'api_key': [
              'write:pets'
            ]
          }
        ],
        'paths': {
          '/': {
            'get': {
              'description': 'asdf'
            }
          }
        }
      };

      return expectNoErrorsOrWarnings(spec);
    }
  );
});
