export const EDITOR_CONTENT_SET_ORIGIN = 'editor_content_set_origin';

export const setContentOrigin = (contentOrigin = 'not-editor') => ({
  type: EDITOR_CONTENT_SET_ORIGIN,
  payload: String(contentOrigin),
});
