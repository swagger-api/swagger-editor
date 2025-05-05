import { ContentOrigin as EditorContentOrigin } from './root-injects.js';

export const EDITOR_CONTENT_SET_ORIGIN = 'editor_content_set_origin';

export const setContentOrigin = (contentOrigin = EditorContentOrigin.NotEditor) => ({
  type: EDITOR_CONTENT_SET_ORIGIN,
  payload: String(contentOrigin),
});
