import { getDefinitionLanguage } from '../../../utils/utils-converter';

export const getDefinitionLanguageFormat = () => async (system) => {
  const { specSelectors } = system;
  const editorContent = specSelectors.specStr();
  if (!editorContent) {
    return Promise.resolve({ languageFormat: 'yaml' });
  }
  const languageFormat = getDefinitionLanguage({ data: editorContent });

  return Promise.resolve({ languageFormat }); // expect 'json' or 'yaml'
};

export const shouldUpdateDefinitionLanguageFormat = ({ languageFormat }) => async (system) => {
  const { specSelectors } = system;
  let updatedLanguageFormat;
  const editorContent = specSelectors.specStr();
  if (!editorContent) {
    updatedLanguageFormat = 'yaml';
  } else {
    updatedLanguageFormat = getDefinitionLanguage({ data: editorContent });
  }
  if (languageFormat !== updatedLanguageFormat) {
    return Promise.resolve({ shouldUpdate: true, languageFormat: updatedLanguageFormat });
  }
  return Promise.resolve({ shouldUpdate: false, languageFormat });
};
