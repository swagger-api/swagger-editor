import YAML from 'js-yaml';

import { getDefinitionLanguage } from '../../../utils/utils-converter';
import { getSpecVersion } from '../../../utils/utils-getSpecVersion';
import { mockOas3Spec, mockAsyncapi2Spec, mockOas2Spec } from './fixtures.actions';

const getInitialDefinitionObj = ({ isOAS3, isSwagger2, isAsyncApi2 }) => {
  // assumes at least 1 arg is true
  let content;
  if (isOAS3) {
    content = mockOas3Spec;
  }
  if (isAsyncApi2) {
    content = mockAsyncapi2Spec;
  }
  if (isSwagger2) {
    content = mockOas2Spec;
  }
  return content;
};

export const clearEditor = () => async (system) => {
  const { specActions, specSelectors } = system;
  // Using an empty string will throw an apidom parser error
  // we will want to detect for various specs, e.g. openapi, asyncapi
  const editorContent = specSelectors.specStr();
  const languageSubType = getDefinitionLanguage({ data: editorContent });
  const { isOAS3, isSwagger2, isAsyncApi2 } = getSpecVersion(system);
  if (!editorContent || (!isOAS3 && !isSwagger2 && !isAsyncApi2)) {
    // default to oas3 yaml
    // JSON String -> JS object
    const jsContent = YAML.safeLoad(JSON.stringify(mockOas3Spec));
    // JS Object -> YAML string
    const yamlContent = YAML.safeDump(jsContent);
    specActions.updateSpec(yamlContent, { lineWidth: -1 });
  } else if (languageSubType !== 'json') {
    const jsContent = getInitialDefinitionObj({ isOAS3, isSwagger2, isAsyncApi2 });
    const yamlContent = YAML.safeDump(jsContent);
    specActions.updateSpec(yamlContent, { lineWidth: -1 });
  } else {
    const jsContent = getInitialDefinitionObj({ isOAS3, isSwagger2, isAsyncApi2 });
    specActions.updateSpec(JSON.stringify(jsContent));
  }
  return { data: 'success' };
};

export default { clearEditor };
