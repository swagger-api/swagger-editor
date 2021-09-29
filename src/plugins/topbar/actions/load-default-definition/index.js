/* eslint-disable camelcase */
// TODO: decide if we want to load json or yaml by default
// We also could accept an optional parameter allowing user to choose
// import YAML from 'js-yaml';

import {
  mockOas2Spec,
  mockOas3Spec,
  mockAsyncapi2Spec,
  mockOas3_1Spec,
} from '../topbar-actions-fixtures';

export const loadDefaultDefinition = (language) => async (system) => {
  const { specActions } = system;
  let contentToLoad;

  if (!language) {
    return { error: 'no language provided' };
  }

  if (language === 'oas3') {
    contentToLoad = JSON.stringify(mockOas3Spec, null, 2);
  } else if (language === 'oas3_1') {
    contentToLoad = JSON.stringify(mockOas3_1Spec, null, 2);
  } else if (language === 'asyncapi2') {
    contentToLoad = JSON.stringify(mockAsyncapi2Spec, null, 2);
  } else if (language === 'oas2') {
    contentToLoad = JSON.stringify(mockOas2Spec, null, 2);
  } else {
    return { error: 'unsupported language provided' };
  }
  // const jsContent = YAML.load(contentToLoad);
  // const yamlContent = YAML.dump(jsContent);
  // on success,
  specActions.updateSpec(contentToLoad);
  return { data: 'success' };
};

export default { loadDefaultDefinition };
