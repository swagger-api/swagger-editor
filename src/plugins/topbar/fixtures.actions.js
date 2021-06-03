export const defaultFixtures = {
  isOAS3: true,
  isSwagger2: true,
  swagger2GeneratorUrl: 'https://generator.swagger.io/api/swagger.json',
  oas3GeneratorUrl: 'https://generator3.swagger.io/openapi.json',
  swagger2ConverterUrl: 'https://converter.swagger.io/api/convert',
  // oas3 & oas2 generator constants for servers list and clients list
  oas3GeneratorServersUrl: 'https://generator3.swagger.io/api/servers',
  oas3GeneratorClientsUrl: 'https://generator3.swagger.io/api/clients',
  oas2GeneratorServersUrl: 'https://generator.swagger.io/api/gen/servers',
  oas2GeneratorClientsUrl: 'https://generator.swagger.io/api/gen/clients',
  // NYI: replace need for swagger-client
  oas3GenerateSpecUrl: 'https://generator3.swagger.io/api/generate', // POST { lang: 'aspnetcore', spec: {}, type: 'SERVER' }
  oas2GenerateSpecServersUrl: 'https://generator.swagger.io/api/gen/servers',
  oas2GenerateSpecClientsUrl: 'https://generator.swagger.io/api/gen/clients',
  // oas2 examples:
  // https://generator.swagger.io/api/gen/servers/ada-server // OPTIONS req, then POST req. { spec: {} }
  // https://generator.swagger.io/api/gen/clients/ada // POST { spec: {} }
};

export const mockOas2Spec = {
  swagger: '2.0',
  info: {
    title: 'OAS2 response examples',
    version: '1.0.0',
  },
  produces: ['application/json'],
  paths: {
    '/foo1': {
      get: {
        summary: 'Response without a schema',
        responses: {
          200: {
            description: 'Successful response',
            examples: {
              'application/json': {
                foo: 'custom value no schema update fail apple',
              },
            },
          },
        },
      },
    },
    '/foo2': {
      get: {
        summary: 'Response with schema',
        responses: {
          200: {
            description: 'Successful response',
            schema: {
              $ref: '#/definitions/Foo',
            },
            examples: {
              'application/json': {
                foo: 'custom value changes ok',
              },
            },
          },
        },
      },
    },
  },
  definitions: {
    Foo: {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          example: 'bar',
        },
      },
    },
  },
};

export const mockOas3Spec = {
  openapi: '3.0.2',
  info: {
    title: 'OAS 3.0 sample with multiple servers',
    version: '0.1.0',
  },
  servers: [
    {
      url: 'http://testserver1.com',
    },
    {
      url: 'http://testserver2.com',
    },
  ],
  paths: {
    '/test/': {
      get: {
        responses: {
          200: {
            description: 'Successful Response',
          },
        },
      },
    },
  },
};
