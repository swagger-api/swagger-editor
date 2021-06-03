import YAML from 'js-yaml';

import { getDefinitionLanguage } from '../../utils/utils-converter';

export const clearEditor = () => async (system) => {
  const { specActions, specSelectors } = system;
  // todo: using an empty string will throw an apidom parser error
  // we will want to detect for various specs, e.g. openapi, asyncapi
  // so for now, we'll use a nearly blank OAS3.0.x spec
  const minimalSpecOas = {
    openapi: '3.0.2',
  };
  const editorContent = specSelectors.specStr();
  const languageSubType = getDefinitionLanguage({ data: editorContent });
  if (!editorContent || languageSubType !== 'json') {
    // default to yaml
    // JSON String -> JS object
    const jsContent = YAML.safeLoad(JSON.stringify(minimalSpecOas));
    // JS Object -> YAML string
    const yamlContent = YAML.safeDump(jsContent);
    specActions.updateSpec(yamlContent, { lineWidth: -1 });
  } else {
    specActions.updateSpec(JSON.stringify(minimalSpecOas));
  }
  return { data: 'success' };
};

export default { clearEditor };
