import { getGeneratorsList } from '../../utils/utils-http';
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

export default { instantiateGeneratorClient, shouldReInstantiateGeneratorClient };
