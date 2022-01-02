/* eslint-disable camelcase */
import { getSpecVersion } from './spec-get-spec-version.js';

// note: need to register as a plugin action in order to access system
export const getIsOasOrAsyncApi2 = () => async (system) => {
  const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);

  if (isOAS3 || isSwagger2 || isOAS3_1) {
    return Promise.resolve({ definitionLanguage: 'oas' });
  }
  if (isAsyncApi2) {
    return Promise.resolve({ definitionLanguage: 'asyncapi2' });
  }
  return Promise.resolve({ definitionLanguage: 'unknown' });
};

// note: need to register as a plugin action in order to access system
export const shouldUpdateDefinitionLanguage = (currentDefinitionLanguage) => async (system) => {
  const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
  let updatedDefinitionLanguage;

  if (isOAS3 || isSwagger2 || isOAS3_1) {
    updatedDefinitionLanguage = 'oas';
  } else if (isAsyncApi2) {
    updatedDefinitionLanguage = 'asyncapi2';
  } else {
    updatedDefinitionLanguage = 'unknown';
  }

  if (updatedDefinitionLanguage !== currentDefinitionLanguage) {
    return Promise.resolve({ shouldUpdate: true, definitionLanguage: updatedDefinitionLanguage });
  }
  return Promise.resolve({ shouldUpdate: false, definitionLanguage: currentDefinitionLanguage });
};

export default { getIsOasOrAsyncApi2, shouldUpdateDefinitionLanguage };
