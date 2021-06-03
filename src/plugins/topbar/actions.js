// re-export
export {
  instantiateGeneratorClient,
  shouldReInstantiateGeneratorClient,
  downloadGeneratedFile,
} from './generator.actions';

export { importFromURL } from './importUrl.actions';
export { clearEditor } from './clearEditor.actions';
export { saveAsJson, saveAsYaml } from './saveAsJsonOrYaml.actions';
export { convertToYaml } from './convertJsonToYaml.actions';
export { convertDefinitionToOas3 } from './convertOas2ToOas3.actions';
export { importFile as handleImportFile } from './importFile.actions';

// Action Types:
// openModal
// closeModal
// setGeneratorUrl
// clearGeneratorUrl
// setDefinitionVersion // e.g. OAS2 vs OAS3
// clearDefinitionVersion
// setOasGeneratorServers
// setOasGeneratorClients
// clearOasGeneratorServers
// clearOasGeneratorClients

// mock data for dev/testing

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

// Utils Actions

/** menu action methods:
 * importFromURL
 * saveAsYaml
 * saveAsJson
 * saveAsText
 * convertToYaml
 * downloadGeneratedFile
 * handleResponse
 * clearEditor
 */

/** Helpers with setState
 * showModal
 * hideModal
 */

/** Logic helpers:
 * getGeneratorUrl
 * instantiateGeneratorClient
 * hasParserErrors
 * getFileName
 * getDefinitionLanguage
 * getDefinitionVersion
 * shouldReInstantiateGeneratorClient (new)
 */
