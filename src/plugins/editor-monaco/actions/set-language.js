export const EDITOR_SET_LANGUAGE = 'editor_set_language';

export const setLanguage = (languageId) => {
  return {
    payload: languageId,
    type: EDITOR_SET_LANGUAGE,
  };
};
