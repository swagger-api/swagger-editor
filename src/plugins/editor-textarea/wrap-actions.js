import debounce from 'lodash/debounce.js';

import { createSafeActionWrapper } from '../util/fn.js';

export const setContentDebouncedImpl = debounce((content, contentOrigin, system) => {
  system.editorActions.setContent(content, contentOrigin);
}, 500);

export const editorSetup = (oriAction) => (editorInstance, implementation) => {
  if (implementation !== 'monaco') {
    globalThis.editor = editorInstance;
    globalThis[implementation] = editorInstance;
  }

  return oriAction(editorInstance, implementation);
};

export const editorTearDown = (oriAction) => (editorInstance, implementation) => {
  if (implementation !== 'monaco') {
    delete globalThis.editor;
    delete globalThis[implementation];
  }

  return oriAction(editorInstance, implementation);
};

export const setContentDebounced = (oriAction, system) => (content, contentOrigin) => {
  setContentDebouncedImpl(content, contentOrigin, system);
};

export const clearContent = createSafeActionWrapper((oriAction, system) => () => {
  const { EditorContentOrigin } = system;

  system.editorActions.setContent('', EditorContentOrigin.Clear);
});
