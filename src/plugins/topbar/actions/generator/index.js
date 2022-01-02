/* eslint-disable camelcase */
import { getGenerator2Definition } from '../../utils.js';
import { getFileDownload } from '../../../../utils/common-file-download.js';
import { getSpecVersion } from '../../../../utils/spec-get-spec-version.js';
import {
  getConfigsWithDefaultFallback,
  getSpecVersionString,
  validateHttpGeneratorsExists,
  fetchOasGeneratorLists,
  fetchGeneratorLinkOrBlob,
} from './utils.js';

export const instantiateGeneratorClient = () => async (system) => {
  const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
  const specVersion = getSpecVersionString({ isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 });
  const generatorHttpExists = validateHttpGeneratorsExists({ specVersion });
  if (!generatorHttpExists) {
    return Promise.resolve({
      servers: [],
      clients: [],
      specVersion,
    });
  }
  const generatorServersClients = await fetchOasGeneratorLists({ isOAS3, isOAS3_1 });
  if (generatorServersClients.error) {
    return Promise.resolve({
      error: generatorServersClients.error,
    });
  }
  return Promise.resolve({
    servers: generatorServersClients.servers,
    clients: generatorServersClients.servers,
    specVersion,
  });
};

export const downloadGeneratedFile =
  ({ type, name }) =>
  async (system) => {
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
  downloadGeneratedFile,
};
