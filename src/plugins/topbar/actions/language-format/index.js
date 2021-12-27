import { getDefinitionLanguage } from '../../../../utils/spec-converter';

export const getDefinitionLanguageFormat = () => async (system) => {
  const { specSelectors } = system;
  const editorContent = specSelectors.specStr();
  if (!editorContent) {
    return Promise.resolve({ languageFormat: 'yaml' });
  }
  const languageFormat = getDefinitionLanguage({ data: editorContent });

  return Promise.resolve({ languageFormat }); // expect 'json' or 'yaml'
};

export default { getDefinitionLanguageFormat };
