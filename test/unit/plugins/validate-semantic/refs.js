
import validateHelper, { expectNoErrorsOrWarnings } from './validate-helper.js';

describe('validation plugin - semantic - refs', () => {
  describe.skip('Refs are restricted in specific areas of a spec', () => {
    describe('Response $refs', () => {
      it(
        'should return a problem for a parameters $ref in a response position',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/CoolPath': {
                responses: {
                  '200': {
                    $ref: '#/parameters/abc'
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
            expect(firstError.path).toEqual(['paths', '/CoolPath', 'responses', '200', '$ref']);
            // expect(firstError.message).toMatch("")
          });
        }
      );

      // FIXME: This poses a problem for our newer validation PR, as it only iterates over the resolved spec.
      // We can look for $$refs, but that may be too fragile.
      // PS: We have a flag in mapSpec, that adds $$refs known as metaPatches
      it(
        'should return a problem for a definitions $ref in a response position',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/CoolPath': {
                schema: {
                  $ref: '#/responses/abc'
                }
              }
            }
          };

          return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            const firstError = allErrors[0];
            expect(allErrors.length).toEqual(1);
            expect(firstError.path).toEqual(['paths', '/CoolPath', 'responses', '200', '$ref']);
            expect(firstError.message).toEqual('Response references are not allowed within schemas');
          });
        }
      );

      it(
        'should not return a problem for a responses $ref in a response position',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/CoolPath': {
                responses: {
                  '200': {
                    $ref: '#/responses/abc'
                  }
                }
              }
            }
          };

          return expectNoErrorsOrWarnings(spec);
        }
      );
    });
    describe('Schema $refs', () => {
      // See note on resolved vs raw spec
      it(
        'should return a problem for a parameters $ref in a schema position',
        () => {
          // const spec = {
          //   paths: {
          //     "/CoolPath": {
          //       schema: {
          //         $ref: "#/parameters/abc"
          //       }
          //     }
          //   }
          // }

          // let res = validate({ jsSpec: spec })
          // expect(res.errors.length).toEqual(1)
          // expect(res.errors[0].path).toEqual(["paths", "/CoolPath", "schema", "$ref"])
          // expect(res.warnings.length).toEqual(0)
        }
      );

      it(
        'should return a problem for a responses $ref in a schema position',
        () => {
          // const spec = {
          //   paths: {
          //     "/CoolPath": {
          //       schema: {
          //         $ref: "#/responses/abc"
          //       }
          //     }
          //   }
          // }
          //
          // let res = validate({ jsSpec: spec })
          // expect(res.errors.length).toEqual(1)
          // expect(res.errors[0].path).toEqual(["paths", "/CoolPath", "schema", "$ref"])
          // expect(res.warnings.length).toEqual(0)
        }
      );

      it(
        'should not return a problem for a definition $ref in a schema position',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/CoolPath': {
                schema: {
                  $ref: '#/definition/abc'
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
        'should not return a problem for a schema property named \'properties\'',
        () => {
          // #492 regression
          const spec = {
            'swagger': '2.0',
            'definitions': {
              'ServicePlan': {
                'description': 'New Plan to be added to a service.',
                'properties': {
                  'plan_id': {
                    'type': 'string',
                    'description': 'ID of the new plan from the catalog.'
                  },
                  'parameters': {
                    '$ref': '#/definitions/Parameter'
                  },
                  'previous_values': {
                    '$ref': '#/definitions/PreviousValues'
                  }
                }
              }
            }
          };

          return validateHelper(spec)
          .then(system => {
            let allErrors = system.errSelectors.allErrors().toJS();
            allErrors = allErrors.filter(a => a.level != 'warning');
            expect(allErrors.length).toEqual(0);
          });
        }
      );
    });
    describe('Parameter $refs', () => {

      it(
        'should return a problem for a definition $ref in a parameter position',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/CoolPath': {
                parameters: [{
                  $ref: '#/definitions/abc'
                }]
              }
            }
          };

          return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['paths', '/CoolPath', 'parameters', '0', '$ref']);
            expect(firstError.message).toMatch('');
          });
        }
      );

      it(
        'should return a problem for a responses $ref in a parameter position',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/CoolPath': {
                parameters: [{
                  $ref: '#/responses/abc'
                }]
              }
            }
          };

          return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.path).toEqual(['paths', '/CoolPath', 'parameters', '0', '$ref']);
            expect(firstError.message).toMatch('');
          });
        }
      );

      it(
        'should not return a problem for a parameter $ref in a parameter position',
        () => {
          const spec = {
            swagger: '2.0',
            paths: {
              '/CoolPath': {
                parameters: [{
                  $ref: '#/parameters/abc'
                }]
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
  });
});
