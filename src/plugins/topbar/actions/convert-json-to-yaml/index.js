import YAML from 'js-yaml';

import { mockOas3Spec } from '../topbar-actions-fixtures';

export const convertToYaml = () => async (system) => {
  const { specSelectors, specActions } = system;
  const editorContent = specSelectors.specStr();
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
  return { data: 'success' };
};

export default { convertToYaml };
