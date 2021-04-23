import SwaggerClient from 'swagger-client';
import URL from 'url';
import YAML from 'js-yaml';
import beautifyJson from 'json-beautify';

import {
  getDefinitionFromUrl,
  getGeneratedDefinition,
  postPerformOasConversion,
} from '../../utils/utils-http';
import { getFileName, hasParserErrors, getDefinitionLanguage } from '../../utils/utils-converter';
import { importFile } from './importFileActions';

const FileDownload = require('js-file-download'); // replaces deprecated react-file-download

// react component helper to trigger browser to save data to file
const getFileDownload = ({ blob, filename }) => {
  // note: When downloading binary data, the data must be a Blob, otherwise the downloaded file will be corrupted.
  FileDownload(blob, filename);
};

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
export const SET_OAS_GENERATOR_SERVERS_LIST = 'topbar_set_oas_generator_servers_list';
export const SET_OAS_GENERATOR_CLIENTS_LIST = 'topbar_set_oas_generator_clients_list';
export const CLEAR_OAS_GENERATOR_SERVERS_LIST = 'topbar_clear_oas_generator_servers_list';
export const CLEAR_OAS_GENERATOR_CLIENTS_LIST = 'topbar_clear_oas_generator_clients_list';

// Redux Actions
export function setOasGeneratorServersList({ value }) {
  // console.log('call redux action with value length:', value.length);
  return {
    type: SET_OAS_GENERATOR_SERVERS_LIST,
    payload: { value },
  };
}

export const setOasGeneratorClientsList = ({ value }) => {
  return {
    type: SET_OAS_GENERATOR_CLIENTS_LIST,
    payload: { value },
  };
};

// mock data for dev/testing

export const defaultFixtures = {
  isOAS3: true,
  isSwagger2: true,
  swagger2GeneratorUrl: 'https://generator.swagger.io/api/swagger.json',
  oas3GeneratorUrl: 'https://generator3.swagger.io/openapi.json',
  swagger2ConverterUrl: 'https://converter.swagger.io/api/convert',
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
const getConfigsWithDefaultFallback = (system) => {
  let { swagger2GeneratorUrl, oas3GeneratorUrl, swagger2ConverterUrl } = system.getConfigs();
  if (!swagger2GeneratorUrl) {
    swagger2GeneratorUrl = defaultFixtures.swagger2GeneratorUrl;
  }
  if (!oas3GeneratorUrl) {
    oas3GeneratorUrl = defaultFixtures.oas3GeneratorUrl;
  }
  if (!swagger2ConverterUrl) {
    swagger2ConverterUrl = defaultFixtures.swagger2ConverterUrl;
  }
  return { swagger2GeneratorUrl, oas3GeneratorUrl, swagger2ConverterUrl };
};

const getSpecVersion = (system) => {
  // currently matching swagger-editor@3 use of flags.
  // extendable to use additional spec versions/types.
  // Todo: still in dev-mode state

  // eslint-disable-next-line no-unused-vars
  const { specSelectors } = system;

  let isSwagger2 = false;
  // eslint-disable-next-line prefer-const
  let isOAS3 = true;

  isOAS3 = specSelectors.isOAS3();
  if (!isOAS3) {
    // isSwagger2 = specSelectors.isSwagger2(); // this sometimes returns undefined
    isSwagger2 = true; // hard override until above line resolved
  }

  return { isOAS3, isSwagger2 };
};

const getSpecVersionString = ({ isOAS3, isSwagger2 }) => {
  // extendable to use additional string constants
  const specStringConstants = {
    OAS_3_0: 'OAS_3_0',
    OAS_3_1: 'OAS_3_1',
    SWAGGER_2: 'SWAGGER_2',
  };
  if (isOAS3 && !isSwagger2) {
    return specStringConstants.OAS_3_0;
  }
  if (isSwagger2 && !isOAS3) {
    return specStringConstants.SWAGGER_2;
  }
  return 'unvailable';
};

const getGeneratorUrl = (args) => {
  // return a string if args match, or null if not
  const { isOAS3, isSwagger2, swagger2GeneratorUrl, oas3GeneratorUrl } = args;

  if (isOAS3) {
    return oas3GeneratorUrl;
  }
  if (isSwagger2) {
    return swagger2GeneratorUrl;
  }
  return null;
};

const fetchSwaggerClientGetters = async ({ generatorUrl, isOAS3 }) => {
  // swagger-client interface: ".makeApisTagOperation()", which transforms raw res.data
  // await a Promise, and attach a .catch to a non-async function
  const data = await SwaggerClient(generatorUrl, {
    requestInterceptor: (req) => {
      // eslint-disable-next-line dot-notation
      req.headers['Accept'] = 'application/json';
      req.headers['Content-Type'] = 'application/json';
    },
  })
    .then(async (client) => {
      const clientGetter = isOAS3
        ? client.apis.clients.clientLanguages
        : client.apis.clients.clientOptions;
      const serverGetter = isOAS3
        ? client.apis.servers.serverLanguages
        : client.apis.servers.serverOptions;
      // calling the methods from generator response
      const clientResults = await clientGetter(
        {},
        {
          // contextUrl is needed because swagger-client is curently
          // not building relative server URLs correctly
          contextUrl: generatorUrl,
        }
      ).then((res) => {
        // expect an array of strings
        return res.body || [];
      });
      // calling the methods from generator response
      const serverResults = await serverGetter(
        {},
        {
          // contextUrl is needed because swagger-client is curently
          // not building relative server URLs correctly
          contextUrl: generatorUrl,
        }
      ).then((res) => {
        // expect an array of strings
        return res.body || [];
      });
      return { clients: clientResults, servers: serverResults };
    })
    .catch(() => {
      return { error: 'unable to retrieve generator url.' };
    });
  return data;
};

export const instantiateGeneratorClient = () => async (system) => {
  // console.log('topbarActions.instantiateGeneratorClient called');
  // set of http call to retrieve generator servers and clients lists
  // which will set a redux state
  const { isOAS3, isSwagger2 } = getSpecVersion(system);
  // console.log('...instantiateGeneratorClient isOAS3:', isOAS3);
  // console.log('...instantiateGeneratorClient isSwagger2:', isSwagger2);
  const { swagger2GeneratorUrl, oas3GeneratorUrl } = getConfigsWithDefaultFallback(system);
  const specVersion = getSpecVersionString({ isOAS3, isSwagger2 });
  // console.log(
  //   '...instantiateGeneratorClient args: swagger2GeneratorUrl',
  //   swagger2GeneratorUrl,
  //   ' | and oas3GeneratorUrl ',
  //   oas3GeneratorUrl
  // );
  // TODO: next-line is production
  // eslint-disable-next-line no-unused-vars
  const argsForGeneratorUrl = {
    isOAS3,
    isSwagger2,
    swagger2GeneratorUrl,
    oas3GeneratorUrl,
  };
  const generatorUrl = getGeneratorUrl(argsForGeneratorUrl);
  // TODO: next-line is for dev.
  // const generatorUrl = getGeneratorUrl(defaultFixtures);
  // console.log('...instantiateGeneratorClient generatorUrl:', generatorUrl);
  const generatorServersClients = await fetchSwaggerClientGetters({ generatorUrl, isOAS3 });
  // console.log('...instantiateGeneratorClient generatorServersClients:', generatorServersClients);
  if (generatorServersClients.error) {
    return Promise.resolve({
      error: generatorServersClients.error,
    });
  }
  setOasGeneratorServersList({ value: generatorServersClients.servers });
  // reducer not receiving; gonna do a temporary workaround and set in state
  return Promise.resolve({
    servers: generatorServersClients.servers,
    clients: generatorServersClients.servers,
    specVersion,
  });
};

export const shouldReInstantiateGeneratorClient = ({ specVersion }) => (system) => {
  // console.log('topbarActions.shouldReInstantiateGeneratorClient called');
  const { isOAS3, isSwagger2 } = getSpecVersion(system);
  const updatedSpecVersion = getSpecVersionString({ isOAS3, isSwagger2 });
  if (specVersion !== updatedSpecVersion) {
    return true;
  }
  return false;
};

export const importFromURL = ({ url }) => async (system) => {
  // console.log('topbarActions.importFromURL called with url:', url);
  const data = await getDefinitionFromUrl({ url });
  if (data.error) {
    // e.g. data.error = 'Request failed with status code 404'
    return { error: data.error };
  }
  // eslint-disable-next-line no-unused-vars
  const { specActions } = system;
  // we will use swagger-ui's specActions to updateSpec
  // as well as any other apidom actions to take
  // note, in theory, we could still return an error after post-processing
  // console.log('we should YAML.safedump and updateSpec', data);
  const jsContent = YAML.safeLoad(JSON.stringify(data));
  const yamlContent = YAML.safeDump(jsContent, { lineWidth: -1 });
  // on success,
  specActions.updateSpec(yamlContent); // nyi: render yaml from props/load in monaco
  return { data: 'success' };
};

const formatParsedUrl = ({ link }) => {
  const downloadUrl = URL.parse(link);
  // HACK: workaround for Swagger.io Generator 2.0's lack of HTTPS downloads
  if (downloadUrl.hostname === 'generator.swagger.io') {
    downloadUrl.protocol = 'https:';
    delete downloadUrl.port;
    delete downloadUrl.host;
  }
  const formattedUrl = URL.format(downloadUrl);
  return formattedUrl;
};

const fetchGeneratorLinkFromSwaggerClientApis = async ({
  generatorUrl,
  isOAS3,
  isSwagger2,
  name,
  type,
  spec,
}) => {
  // swagger-client interface: ".makeApisTagOperation()", which transforms raw res.data
  const generatorLinkOrBlob = await SwaggerClient(generatorUrl, {
    requestInterceptor: (req) => {
      // eslint-disable-next-line dot-notation
      req.headers['Accept'] = 'application/json';
      req.headers['Content-Type'] = 'application/json';
    },
  }).then(async (client) => {
    // console.log('TEST: do we have direct swagger-client method apis?', client.apis);
    let swaggerClientData;
    // Generator 3 only has one generate endpoint for all types of things...
    // since we're using the tags interface we may as well use the client reference to it
    if (isOAS3) {
      // Return an object with Blob, regardless of type (server/client)
      // await a Promise, and attach a .catch to a non-async function
      swaggerClientData = await client.apis.clients
        .generate(
          {},
          {
            requestBody: {
              spec,
              type: type.toUpperCase(),
              lang: name,
            },
            contextUrl: generatorUrl,
          }
        )
        .then((res) => res)
        .catch(() => {
          // e.g. empty spec provided, or provided invalid name for oas3
          return { error: 'unable to retrieve generator url.' };
        });
      if (swaggerClientData.error) {
        return swaggerClientData;
      }
      // returning full object, with data: Blob
      return swaggerClientData;
    }
    if (isSwagger2 && type === 'server') {
      // await a Promise, and attach a .catch to a non-async function
      swaggerClientData = await client.apis.servers
        .generateServerForLanguage({
          framework: name,
          body: JSON.stringify({
            spec,
          }),
          headers: JSON.stringify({
            Accept: 'application/json',
          }),
        })
        .then((res) => res)
        .catch(() => {
          // e.g. empty spec provided
          return { error: 'unable to retrieve generator url.' };
        });
      if (swaggerClientData.error) {
        return swaggerClientData;
      }
      if (!swaggerClientData.body || !swaggerClientData.body.link) {
        return { error: 'invalid or missing generator url' };
      }
      const link = formatParsedUrl({ link: swaggerClientData.body.link });
      return { link };
    }
    if (isSwagger2 && type === 'client') {
      // await a Promise, and attach a .catch to a non-async function
      swaggerClientData = await client.apis.clients
        .generateClient({
          language: name,
          body: JSON.stringify({
            spec,
          }),
        })
        .then((res) => res)
        .catch(() => {
          // e.g. empty spec provided
          return { error: 'unable to retrieve generator url.' };
        });
      if (swaggerClientData.error) {
        return swaggerClientData;
      }
      if (!swaggerClientData.body || !swaggerClientData.body.link) {
        return { error: 'invalid or missing generator url' };
      }
      const link = formatParsedUrl({ link: swaggerClientData.body.link });
      // in a different case, we return {...data }, so we return 'link' key here instead
      return { link };
    }
    // default empty case
    return { error: 'unable to create generator url' };
  });
  // expect return object with single key, oneOf [data, link, error]
  return generatorLinkOrBlob;
};

export const downloadGeneratedFile = ({ type, name }) => async (system) => {
  const { specSelectors } = system;
  const { swagger2GeneratorUrl, oas3GeneratorUrl } = getConfigsWithDefaultFallback(system);
  const { isOAS3, isSwagger2 } = getSpecVersion(system);

  const argsForGeneratorUrl = {
    isOAS3,
    isSwagger2,
    swagger2GeneratorUrl,
    oas3GeneratorUrl,
  };
  const generatorUrl = getGeneratorUrl(argsForGeneratorUrl);
  // console.log('...downloadGeneratedFile generatorUrl:', generatorUrl);
  const spec = specSelectors.specJson();
  // const spec = mockOas2Spec;
  // const spec = mockOas3Spec;
  const generatorLink = await fetchGeneratorLinkFromSwaggerClientApis({
    generatorUrl,
    isOAS3: argsForGeneratorUrl.isOAS3,
    isSwagger2: argsForGeneratorUrl.isSwagger2,
    name,
    type,
    spec,
  });
  if (generatorLink.error) {
    return { error: generatorLink.error };
  }

  const filename = `${name}-${type}-generated.zip`;
  if (generatorLink.link) {
    // swagger2: check axios fetch responseType: 'blob', then download
    const fetchedDataWithBlob = await getGeneratedDefinition({ url: generatorLink.link });
    if (fetchedDataWithBlob.data && fetchedDataWithBlob.data instanceof Blob) {
      getFileDownload({ blob: fetchedDataWithBlob.data, filename });
    }
  } else if (generatorLink.data && generatorLink.data instanceof Blob) {
    // oas3: check swagger-client responseType: 'blob', then download
    getFileDownload({ blob: generatorLink.data, filename });
  }
  return { data: 'ok' };
};

export const convertDefinitionToOas3 = () => async (system) => {
  const { specSelectors, specActions } = system;

  const { swagger2ConverterUrl } = getConfigsWithDefaultFallback(system);
  const swagger2editorContent = specSelectors.specStr();

  // eslint-disable-next-line no-unused-vars
  // const mockOptions = {
  //   swagger2editorContent: mockOas2Spec,
  // };
  const conversionResult = await postPerformOasConversion({
    url: swagger2ConverterUrl,
    data: swagger2editorContent,
  });
  // console.log('conversionResult:', conversionResult);
  if (!conversionResult.error) {
    specActions.updateSpec(conversionResult, 'insert');
    return { data: 'success' };
  }
  return { error: 'unable to convert spec to OAS3' };
};

export const convertToYaml = () => async (system) => {
  const { specSelectors, specActions } = system;
  const editorContent = specSelectors.specStr();
  // dev mode; refactor 'contentToConvert' to handle case if editorContent is undefined
  let contentToConvert;
  if (!editorContent) {
    contentToConvert = JSON.stringify(mockOas2Spec);
  } else {
    contentToConvert = editorContent;
  }
  const jsContent = YAML.safeLoad(contentToConvert);
  const yamlContent = YAML.safeDump(jsContent);
  // on success,
  specActions.updateSpec(yamlContent);
  // we should also update monaco value
  return { data: 'success' };
};

export const saveAsJson = () => async (system) => {
  const { specSelectors, errSelectors } = system;
  const editorContent = specSelectors.specStr();
  // eslint-disable-next-line no-unused-vars
  const { isOAS3, isSwagger2 } = getSpecVersion(system);
  // eslint-disable-next-line no-unused-vars
  const options = { isOAS3, isSwagger2 };

  // dev mode; refactor 'contentToConvert' to handle case if editorContent is undefined
  // create a mock yaml from mock json (ref: convertToYaml)
  let contentToConvert;
  if (!editorContent) {
    const tempjsContent = YAML.safeLoad(JSON.stringify(mockOas2Spec));
    const tempyamlContent = YAML.safeDump(tempjsContent);
    contentToConvert = tempyamlContent;
  } else {
    contentToConvert = editorContent;
  }
  const mockOptions = {
    isOAS3: true,
    isSwagger2: true,
  };
  // end dev mode scaffold
  const fileName = getFileName({ options: mockOptions.isOAS3 });
  const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });
  if (parserErrorExists) {
    // legacy alert window, which we should use a generic modal instead
    return {
      error:
        'Save as JSON is not currently possible because Swagger-Editor was not able to parse your API definiton.',
    };
  }
  // JSON or YAML String -> JS object
  const jsContent = YAML.safeLoad(contentToConvert);
  // JS Object -> pretty JSON string
  const prettyJsonContent = beautifyJson(jsContent, null, 2);
  getFileDownload({ blob: prettyJsonContent, filename: `${fileName}.json` });
  return { data: 'ok' };
};

export const saveAsYaml = ({ overrideWarning }) => async (system) => {
  // console.log('actions.saveAsYaml');
  const { specSelectors, errSelectors } = system;
  const editorContent = specSelectors.specStr();
  // eslint-disable-next-line no-unused-vars
  const { isOAS3, isSwagger2 } = getSpecVersion(system);
  // eslint-disable-next-line no-unused-vars
  const options = { isOAS3, isSwagger2 };

  // dev mode; refactor 'contentToConvert' to handle case if editorContent is undefined
  // create a mock yaml from mock json (ref: convertToYaml)
  let contentToConvert;
  if (!editorContent) {
    const tempjsContent = YAML.safeLoad(JSON.stringify(mockOas2Spec));
    // eslint-disable-next-line no-unused-vars
    const tempyamlContent = YAML.safeDump(tempjsContent);
    contentToConvert = tempyamlContent;
    // contentToConvert = JSON.stringify(mockOas2Spec);
  } else {
    contentToConvert = editorContent;
  }
  const mockOptions = {
    isOAS3: true,
    isSwagger2: true,
  };
  // end dev mode scaffold
  const fileName = getFileName({ options: mockOptions.isOAS3 });
  const languageSubType = getDefinitionLanguage({ data: contentToConvert });
  const parserErrorExists = hasParserErrors({ errors: errSelectors.allErrors() });
  // const parserErrorExists = true; // mock test
  if (parserErrorExists && !overrideWarning) {
    // legacy method, if already yaml, displays confirm window if parser error
    if (languageSubType === 'yaml') {
      return {
        warning:
          'Swagger - Editor is not able to parse your API definition. Are you sure you want to save the editor content as YAML?',
      };
    }
    // legacy alert window, which we should use a generic modal instead
    return {
      error:
        'Save as YAML is not currently possible because Swagger-Editor was not able to parse your API definiton.',
    };
  }

  if (languageSubType === 'yaml') {
    // console.log('download yaml as-is');
    // content is already yaml, so download as-is
    getFileDownload({ blob: contentToConvert, filename: `${fileName}.yaml` });
    return { data: 'ok' };
  }
  // console.log('download yaml from json');
  // JSON String -> JS object
  const jsContent = YAML.safeLoad(contentToConvert);
  // JS Object -> YAML string
  const yamlContent = YAML.safeDump(jsContent);
  getFileDownload({ blob: yamlContent, filename: `${fileName}.json` });
  return { data: 'ok' };
};

// This is an example of an imported action that we re-export
export const handleImportFile = () => importFile;

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
