/**
 * @prettier
 */


import validateHelper, { expectNoErrors } from '../validate-helper.js';

describe('validation plugin - semantic - 2and3 tags', () => {
  describe('global `tags` array', () => {
    describe('OpenAPI 3.0', () => {
      it('should return an error when two tag objects are equivalent', () => {
        const spec = {
          openapi: '3.0.0',
          tags: [
            {
              name: 'pet',
            },
            {
              name: 'pet',
            },
          ],
        };

        return validateHelper(spec).then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.message).toEqual('Tag Objects must have unique `name` field values.');
          expect(firstError.path).toEqual(['tags', '1']);
        });
      });
      it('should return an error when two tag objects have the same name', () => {
        const spec = {
          openapi: '3.0.0',
          tags: [
            {
              name: 'pet',
            },
            {
              name: 'pet',
              description: 'Everything about your pets',
            },
          ],
        };

        return validateHelper(spec).then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.message).toEqual('Tag Objects must have unique `name` field values.');
          expect(firstError.path).toEqual(['tags', '1']);
        });
      });
      it('should not return an error when two tags have unique names', () => {
        const spec = {
          openapi: '3.0.0',
          tags: [
            {
              name: 'pet',
            },
            {
              name: 'store',
            },
          ],
        };

        return expectNoErrors(spec);
      });
    });
    describe('Swagger 2.0', () => {
      it('should return an error when two tag objects are equivalent', () => {
        const spec = {
          swagger: '2.0',
          tags: [
            {
              name: 'pet',
            },
            {
              name: 'pet',
            },
          ],
        };

        return validateHelper(spec).then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.message).toEqual('Tag Objects must have unique `name` field values.');
          expect(firstError.path).toEqual(['tags', '1']);
        });
      });
      it('should return an error when two tag objects have the same name', () => {
        const spec = {
          swagger: '2.0',
          tags: [
            {
              name: 'pet',
            },
            {
              name: 'pet',
              description: 'Everything about your pets',
            },
          ],
        };

        return validateHelper(spec).then(system => {
          const allErrors = system.errSelectors.allErrors().toJS();
          const firstError = allErrors[0];
          expect(allErrors.length).toEqual(1);
          expect(firstError.message).toEqual('Tag Objects must have unique `name` field values.');
          expect(firstError.path).toEqual(['tags', '1']);
        });
      });
      it('should not return an error when two tags have unique names', () => {
        const spec = {
          swagger: '2.0',
          tags: [
            {
              name: 'pet',
            },
            {
              name: 'store',
            },
          ],
        };

        return expectNoErrors(spec);
      });
    });
  });
});
