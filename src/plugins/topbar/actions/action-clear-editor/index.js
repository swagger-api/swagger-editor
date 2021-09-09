import YAML from 'js-yaml';

import { getDefinitionLanguage } from '../../../../utils/editor-converter';
import { getSpecVersion } from '../../../../utils/editor-get-spec-version';
import { getInitialDefinitionObj } from './clear-editor';
import { mockOas3Spec } from '../topbar-actions-fixtures';

/**
 * History: Using an empty string previously threw an apidom parser error
 * This method detects for various definitionLanguage, e.g. openapi, asyncapi
 * and "reset" the editor to a default definition matching the previous definitionLanguage
 * @returns Object
 */
export const resetEditor = () => async (system) => {
  const { specActions, specSelectors } = system;
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

/**
 * Background: This implementation is specific to swagger-ui@3/swagger-ui@4
 * in which the visual ui will only re-render after conversion of an empty string to yaml
 * e.g. simply providing empty string to specActions.updateSpec will not re-render ui
 * Separately, monaco will replace empty string with its default value,
 * but even if monaco default value is empty string, as noted above, ui will not re-render
 * Hopefully this behavior changes with the next major release of swagger-ui
 * @returns Object
 */
export const clearEditor = () => async (system) => {
  const { specActions } = system;
  // provide a default value to trigger swagger-ui re-render
  const jsContent = { tip: 'replace this line' };
  const yamlContent = YAML.safeDump(jsContent);
  specActions.updateSpec(yamlContent, { lineWidth: -1 });
  return { data: 'success' };
};

export default { clearEditor, resetEditor };
