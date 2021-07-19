import YAML from 'js-yaml';

// eslint-disable-next-line camelcase
import { mockOas2Spec, mockOas3Spec, mockAsyncapi2Spec, mockOas3_1Spec } from './fixtures.actions';

export const loadDefaultDefinition = (language) => async (system) => {
  const { specActions } = system;
  let contentToLoad;

  if (!language) {
    return { error: 'no language provided' };
  }

  if (language === 'oas3') {
    contentToLoad = JSON.stringify(mockOas3Spec);
  } else if (language === 'oas3_1') {
    contentToLoad = JSON.stringify(mockOas3_1Spec);
  } else if (language === 'asyncapi2') {
    contentToLoad = JSON.stringify(mockAsyncapi2Spec);
  } else if (language === 'oas2') {
    contentToLoad = JSON.stringify(mockOas2Spec);
  } else {
    return { error: 'unsupported language provided' };
  }
  const jsContent = YAML.safeLoad(contentToLoad);
  const yamlContent = YAML.safeDump(jsContent);
  // on success,
  specActions.updateSpec(yamlContent);
  return { data: 'success' };
};

export default { loadDefaultDefinition };
