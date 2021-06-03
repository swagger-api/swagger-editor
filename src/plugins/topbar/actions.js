import URL from 'url';
import YAML from 'js-yaml';
import beautifyJson from 'json-beautify';

import {
  getGenerator2Definition,
  postPerformOasConversion,
  postGenerator3WithSpec,
} from '../../utils/utils-http';
import { getFileName, hasParserErrors, getDefinitionLanguage } from '../../utils/utils-converter';

const FileDownload = require('js-file-download'); // replaces deprecated react-file-download

// react component helper to trigger browser to save data to file
const getFileDownload = ({ blob, filename }) => {
  // note: When downloading binary data, the data must be a Blob, otherwise the downloaded file will be corrupted.
  FileDownload(blob, filename);
};

// re-export
export {
  instantiateGeneratorClient,
  shouldReInstantiateGeneratorClient,
} from './generator.actions';

export { importFromURL } from './importUrl.actions';
export { clearEditor } from './clearEditor.actions';
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

const fetchGeneratorLinkOrBlob = async ({ isSwagger2, isOAS3, name, type, spec }) => {
  // generator 3 will return a Blob
  // generator 2 will return a json object
  if (!spec) {
    return { error: 'unable to create generator url. missing spec' };
  }
  if (!type) {
    return { error: 'unable to create generator url. missing type' };
  }
  if (!name) {
    return { error: 'unable to create generator url. missing name' };
  }

  if (isOAS3) {
    // Generator 3 only has one generate endpoint for all types of things...
    // Return an object with Blob, regardless of type (server/client)
    const generatorData = await postGenerator3WithSpec({
      url: defaultFixtures.oas3GenerateSpecUrl,
      data: {
        spec,
        type: type.toUpperCase(),
        lang: name,
      },
    });
    if (generatorData.error) {
      return generatorData; // res.body.error
    }
    return generatorData; // generatorData = { data: Blob}
  }
  if (isSwagger2) {
    if (type !== 'server' || type !== 'client') {
      return { error: 'unable to create generator url. invalid type' };
    }
    let urlWithType;
    if (type === 'server') {
      urlWithType = `${defaultFixtures.oas2GenerateSpecServersUrl}/${name}`;
    }
    if (type === 'client') {
      urlWithType = `${defaultFixtures.oas2GenerateSpecClientsUrl}/${name}`;
    }
    // todo: verify not needed to JSON.stringify(spec)
    const generatorData = await postGenerator3WithSpec({
      url: urlWithType,
      data: {
        spec,
        options: {
          responseType: 'json',
        },
      },
    });
    if (generatorData.error) {
      return generatorData; // res.body.error
    }
    // console.log('generator...swagger 2 case.. generatorData:', generatorData);
    // expecting generatorData = { code: '', link: ''}
    const link = formatParsedUrl({ link: generatorData.link });
    return { link };
  }
  // default empty case
  return { error: 'unable to create generator url' };
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
  const spec = specSelectors.specJson();

  const generatorLink = await fetchGeneratorLinkOrBlob({
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
    const fetchedDataWithBlob = await getGenerator2Definition({ url: generatorLink.link });
    if (fetchedDataWithBlob.data && fetchedDataWithBlob.data instanceof Blob) {
      getFileDownload({ blob: fetchedDataWithBlob.data, filename });
    }
  } else if (generatorLink.data && generatorLink.data instanceof Blob) {
    // oas3: generator3 returns blob already, so just download
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
  // eslint-disable-next-line no-unused-vars
  // const mockOptions = {
  //   isOAS3: true,
  //   isSwagger2: true,
  // };
  // end dev mode scaffold
  const fileName = getFileName({ options: options.isOAS3 });
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
  // eslint-disable-next-line no-unused-vars
  // const mockOptions = {
  //   isOAS3: true,
  //   isSwagger2: true,
  // };
  // end dev mode scaffold
  const fileName = getFileName({ options: options.isOAS3 });
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
  getFileDownload({ blob: yamlContent, filename: `${fileName}.yaml` });
  return { data: 'ok' };
};

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
