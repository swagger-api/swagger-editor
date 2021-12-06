import { createSelector } from 'reselect';

import { getSpecVersion } from '../../utils/spec-get-spec-version';
import { getSpecVersionString } from './actions/generator/utils';
import { getDefinitionLanguage } from '../../utils/spec-converter';

// eslint-disable-next-line import/prefer-default-export
export const selectShouldReInstantiateGeneratorClient =
  (state, { specVersion }) =>
  (system) =>
    createSelector(() => {
      // eslint-disable-next-line camelcase
      const { isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 } = getSpecVersion(system);
      const updatedSpecVersion = getSpecVersionString({
        isOAS3,
        isSwagger2,
        isOAS3_1,
        isAsyncApi2,
      });
      if (specVersion !== updatedSpecVersion) {
        return true;
      }
      return false;
    })(state);

export const selectShouldUpdateDefinitionLanguageFormat =
  (state, { languageFormat }) =>
  (system) =>
    createSelector(() => {
      const { specSelectors } = system;
      let updatedLanguageFormat;
      const editorContent = specSelectors.specStr();
      if (!editorContent) {
        updatedLanguageFormat = 'yaml';
      } else {
        updatedLanguageFormat = getDefinitionLanguage({ data: editorContent });
      }
      if (languageFormat !== updatedLanguageFormat) {
        return { shouldUpdate: true, languageFormat: updatedLanguageFormat };
      }
      return { shouldUpdate: false, languageFormat };
    })(state);
