import debounce from 'lodash/debounce.js';

import { createSafeActionWrapper } from '../util/fn.js';

export const setContentDebouncedImpl = debounce((content, contentOrigin, system) => {
  system.editorActions.setContent(content, contentOrigin);
}, 500);

export const editorSetup = (oriAction) => (editorInstance, implementation) => {
  oriAction(editorInstance, implementation);

  globalThis.editor = editorInstance;
  globalThis[implementation] = editorInstance;
};

export const editorTearDown = (oriAction) => (editorInstance, implementation) => {
  oriAction(editorInstance, implementation);

  delete globalThis.editor;
  delete globalThis[implementation];
};

export const setContentDebounced = (oriAction, system) => (content, contentOrigin) => {
  setContentDebouncedImpl(content, contentOrigin, system);
};

export const clearContent = createSafeActionWrapper((oriAction, system) => () => {
  const { EditorContentOrigin } = system;

  system.editorActions.setContent('', EditorContentOrigin.Clear);
});
