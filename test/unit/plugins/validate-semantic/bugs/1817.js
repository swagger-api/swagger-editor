import { expectNoErrors } from '../validate-helper.js';

describe('editor bug #1817 - path parameter semantic error with TRACE', () => {
  it(
    'should return no problems for a path parameter defined in a Swagger 2 TRACE operation',
    () => {
      const spec = {
        swagger: '2.0',
        paths: {
          '/CoolPath/{id}': {
            trace: {
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ]
            }
          }
        }
      };

      return expectNoErrors(spec);
    }
  );
  it(
    'should return no problems for a path parameter defined in an OpenAPI 3 TRACE operation',
    () => {
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/CoolPath/{id}': {
            trace: {
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ]
            }
          }
        }
      };

      return expectNoErrors(spec);
    }
  );
});