/* eslint-disable camelcase */
import { getGeneratorsList, postGenerator3WithSpec } from '../../utils';
import { defaultFixtures } from '../topbar-actions-fixtures';

// currently re-used
export const getConfigsWithDefaultFallback = (system) => {
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

export const getSpecVersionString = ({ isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 }) => {
  // extendable to use additional string constants
  const specStringConstants = {
    OAS_3_0: 'OAS_3_0',
    OAS_3_1: 'OAS_3_1',
    SWAGGER_2: 'SWAGGER_2',
    ASYNCAPI_2: 'ASYNCAPI_2',
  };
  if (isOAS3 && !isSwagger2) {
    return specStringConstants.OAS_3_0;
  }
  if (isSwagger2 && !isOAS3) {
    return specStringConstants.SWAGGER_2;
  }
  if (isOAS3_1) {
    return specStringConstants.OAS_3_1;
  }
  if (isAsyncApi2) {
    return specStringConstants.ASYNCAPI_2;
  }
  return 'unvailable';
};

export const validateHttpGeneratorsExists = ({ specVersion }) => {
  if (specVersion === 'OAS_3_0' || specVersion === 'SWAGGER_2' || specVersion === 'OAS_3_1') {
    return true;
  }
  return false;
};

export const fetchOasGeneratorLists = async ({ isOAS3, isOAS3_1 }) => {
  let isAnyVersionOAS3 = false;
  if (isOAS3 || isOAS3_1) {
    isAnyVersionOAS3 = true;
  }
  const generatorClientsUrl = isAnyVersionOAS3
    ? defaultFixtures.oas3GeneratorClientsUrl
    : defaultFixtures.oas2GeneratorServersUrl;
  const generatorServersUrl = isAnyVersionOAS3
    ? defaultFixtures.oas3GeneratorServersUrl
    : defaultFixtures.oas2GeneratorServersUrl;

  const clientData = await getGeneratorsList({ url: generatorClientsUrl });
  const serverData = await getGeneratorsList({ url: generatorServersUrl });

  const clientsList = clientData.error ? [] : clientData;
  const serversList = serverData.error ? [] : serverData;

  return { clients: clientsList, servers: serversList };
};

// Begin section: download generated file

export const formatParsedUrl = ({ link }) => {
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

export const fetchGeneratorLinkOrBlob = async ({ isSwagger2, isOAS3, name, type, spec }) => {
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
    // expecting generatorData = { code: '', link: ''}
    const link = formatParsedUrl({ link: generatorData.link });
    return { link };
  }
  // default empty case
  return { error: 'unable to create generator url' };
};

export default {
  getConfigsWithDefaultFallback,
  getSpecVersionString,
  validateHttpGeneratorsExists,
  fetchOasGeneratorLists,
  fetchGeneratorLinkOrBlob,
};
