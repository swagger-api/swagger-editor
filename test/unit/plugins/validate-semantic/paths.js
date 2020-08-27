import validateHelper, { expectNoErrors } from './validate-helper.js';

describe('validation plugin - semantic - paths', () => {
  describe('Empty path templates are not allowed', () => {

    it('should return one problem for an empty path template', () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath/{}': {}
        }
      };

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.message).toEqual( 'Empty path parameter declarations are not valid');
          expect(firstError.path).toEqual(['paths', '/CoolPath/{}']);
        });
    });

  });

  describe('Path parameters declared in the path string need matching definitions', () => {

    it(
      'should return one problem for an undefined declared path parameter',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath/{id}': {}
          }
        };

        return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toEqual( 'Declared path parameter "id" needs to be defined as a path parameter at either the path or operation level');
            expect(firstError.path).toEqual(['paths', '/CoolPath/{id}']);
          });
      }
    );

    it(
      'should return one problem for an path parameter defined in another path',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath/{id}': {},
            '/UncoolPath/{id}': {
              parameters: [{
                name: 'id',
                in: 'path',
                required: true
              }]
            }
          }
        };

        return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toEqual('Declared path parameter "id" needs to be defined as a path parameter at either the path or operation level');
            expect(firstError.path).toEqual(['paths', '/CoolPath/{id}']);
          });
      }
    );

    it(
      'should return no problems for a path parameter defined in the path',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath/{id}': {
              parameters: [{
                name: 'id',
                in: 'path',
                required: true
              }]
            }
          }
        };

        return expectNoErrors(spec);
      }
    );

    it(
      'should return no problems for a path parameter defined in an operation',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath/{id}': {
              get: {
                parameters: [{
                  name: 'id',
                  in: 'path',
                  required: true
                }]
              }
            }
          }
        };

        return expectNoErrors(spec);
      }
    );

  });

  describe('Path strings must be equivalently different', () => {

    it(
      'should return one problem for an equivalent templated path strings',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath/{id}': {
              parameters: [{
                name: 'id',
                in: 'path',
                required: true
              }]
            },
            '/CoolPath/{count}': {
              parameters: [{
                name: 'count',
                in: 'path',
                required: true
              }]
            }
          }
        };

        return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors.allErrors().toJS();
            expect(allErrors.length).toEqual(1);
            const firstError = allErrors[0];
            expect(firstError.message).toEqual('Equivalent paths are not allowed.');
            expect(firstError.path).toEqual(['paths', '/CoolPath/{count}']);
          });
      }
    );

    it(
      'should return no problems for a templated and untemplated pair of path strings',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath/': {},
            '/CoolPath/{count}': {
              parameters: [{
                name: 'count',
                in: 'path',
                required: true
              }]
            }
          }
        };

        return expectNoErrors(spec);
      }
    );

    it(
      'should return no problems for a templated and double-templated set of path strings',
      () => {
        const spec = {
          swagger: '2.0',
          paths: {
            '/CoolPath/{group_id1}/all': {
              parameters: [{
                name: 'group_id1',
                in: 'path',
                required: true
              }]
            },
            '/CoolPath/{group_id2}/{user_id2}': {
              parameters: [
                {
                  name: 'group_id2',
                  in: 'path',
                  required: true
                },
                {
                  name: 'user_id2',
                  in: 'path',
                  required: true
                },
              ]
            },
          }
        };

        return expectNoErrors(spec);
      }
    );

  });

  describe('Paths must have unique name + in parameters', () => {
    it('should return no problems for a name collision only', () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath/{id}': {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true
              },
              {
                name: 'id',
                in: 'query'
              }
            ]
          }
        }
      };

      return expectNoErrors(spec);
    });

    it('should return no problems when \'in\' is not defined', () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath/{id}': {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true
              },
              {
                name: 'id',
                // in: "path"
              }
            ]
          }
        }
      };

      return expectNoErrors(spec);
    });

  });

  describe('Integrations', () => {
    it.skip(
      'should return two problems for an equivalent path string missing a parameter definition',
      function(){
        // const spec = {
        //   paths: {
        //     "/CoolPath/{id}": {
        //       parameters: [{
        //         name: "id",
        //         in: "path"
        //       }]
        //     },
        //     "/CoolPath/{count}": {}
        //   }
        // }
        //
        // let res = validate({ resolvedSpec: spec })
        // expect(res.errors).toEqual([
        //   {
        //     message: "Equivalent paths are not allowed.",
        //     path: "paths./CoolPath/{count}"
        //   },
        //   {
        //     message: "Declared path parameter \"count\" needs to be defined as a path parameter at either the path or operation level",
        //     path: "paths./CoolPath/{count}"
        //   }
        // ])
        // expect(res.warnings).toEqual([])
      }
    );

  });
});
