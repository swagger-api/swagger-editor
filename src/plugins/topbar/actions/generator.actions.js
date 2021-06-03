import URL from 'url'; // wrapper for node method

import {
  getGeneratorsList,
  getGenerator2Definition,
  postGenerator3WithSpec,
} from '../../../utils/utils-http';
import { getFileDownload } from '../../../utils/utils-file-download';
import { defaultFixtures } from './fixtures.actions';

// Redux
export const SET_OAS_GENERATOR_SERVERS_LIST = 'topbar_set_oas_generator_servers_list';
export const SET_OAS_GENERATOR_CLIENTS_LIST = 'topbar_set_oas_generator_clients_list';
export const CLEAR_OAS_GENERATOR_SERVERS_LIST = 'topbar_clear_oas_generator_servers_list';
export const CLEAR_OAS_GENERATOR_CLIENTS_LIST = 'topbar_clear_oas_generator_clients_list';

// Redux Actions
export function setOasGeneratorServersList({ value }) {
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

// Begin non-redux actions

// currently re-used
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

// currently re-used
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

const fetchOasGeneratorLists = async ({ isOAS3 }) => {
  const generatorClientsUrl = isOAS3
    ? defaultFixtures.oas3GeneratorClientsUrl
    : defaultFixtures.oas2GeneratorServersUrl;
  const generatorServersUrl = isOAS3
    ? defaultFixtures.oas3GeneratorServersUrl
    : defaultFixtures.oas2GeneratorServersUrl;

  const clientData = await getGeneratorsList({ url: generatorClientsUrl });
  const serverData = await getGeneratorsList({ url: generatorServersUrl });

  const clientsList = clientData.error ? [] : clientData;
  const serversList = serverData.error ? [] : serverData;

  return { clients: clientsList, servers: serversList };
};

export const instantiateGeneratorClient = () => async (system) => {
  // console.log('topbarActions.instantiateGeneratorClient called');
  // set of http call to retrieve generator servers and clients lists
  // which will set a redux state
  const { isOAS3, isSwagger2 } = getSpecVersion(system);
  const specVersion = getSpecVersionString({ isOAS3, isSwagger2 });

  const generatorServersClients = await fetchOasGeneratorLists({ isOAS3 });
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

// Begin section: download generated file

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

export default {
  instantiateGeneratorClient,
  shouldReInstantiateGeneratorClient,
  downloadGeneratedFile,
};
