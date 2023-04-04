export const EDITOR_SET_THEME = 'editor_set_theme';

export const setTheme = (theme = 'my-vs-dark') => {
  return {
    payload: theme,
    type: EDITOR_SET_THEME,
  };
};
