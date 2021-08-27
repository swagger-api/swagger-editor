import YAML from 'js-yaml';

import { getDefinitionLanguage } from '../../../../utils/editor-converter';
import { getSpecVersion } from '../../../../utils/editor-get-spec-version';
import { getInitialDefinitionObj } from './clear-editor';
import { mockOas3Spec } from '../topbar-actions-fixtures';

export const clearEditor = () => async (system) => {
  const { specActions, specSelectors } = system;
  // Using an empty string will throw an apidom parser error
  // we will want to detect for various specs, e.g. openapi, asyncapi
  const editorContent = specSelectors.specStr();
  const languageFormat = getDefinitionLanguage({ data: editorContent });
  // eslint-disable-next-line camelcase
  const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
  // eslint-disable-next-line camelcase
  if (!editorContent || (!isOAS3 && !isOAS3_1 && !isSwagger2 && !isAsyncApi2)) {
    // default to oas3 yaml
    // JSON String -> JS object
    const jsContent = YAML.safeLoad(JSON.stringify(mockOas3Spec));
    // JS Object -> YAML string
    const yamlContent = YAML.safeDump(jsContent);
    specActions.updateSpec(yamlContent, { lineWidth: -1 });
  } else if (languageFormat !== 'json') {
    const jsContent = getInitialDefinitionObj({ isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 });
    const yamlContent = YAML.safeDump(jsContent);
    specActions.updateSpec(yamlContent, { lineWidth: -1 });
  } else {
    const jsContent = getInitialDefinitionObj({ isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 });
    specActions.updateSpec(JSON.stringify(jsContent));
  }
  return { data: 'success' };
};

export default { clearEditor };
