import { ContentOrigin as EditorContentOrigin } from './root-injects.js';

// eslint-disable-next-line import/prefer-default-export
export const selectContentOrigin = (state) =>
  state.get('contentOrigin') || EditorContentOrigin.NotEditor;
