import YAML from 'js-yaml';

import { mockOas3Spec } from './fixtures.actions';

export const convertToYaml = () => async (system) => {
  const { specSelectors, specActions } = system;
  const editorContent = specSelectors.specStr();
  // dev mode; refactor 'contentToConvert' to handle case if editorContent is undefined
  let contentToConvert;
  if (!editorContent) {
    contentToConvert = JSON.stringify(mockOas3Spec);
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

export default { convertToYaml };
