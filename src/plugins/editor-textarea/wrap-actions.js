import debounce from 'lodash/debounce.js';

import createSafeActionWrapper from '../../utils/create-safe-action-wrapper.js';

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
  system.editorActions.setContent('', 'clear');
});

/**
 * This wrapped action makes sure that setting initial definition
 * via `spec` or `url` SwaggerUI option is propagated to editor content.
 */
export const updateSpec = (oriAction, system) => (spec, origin) => {
  const { editorActions, editorSelectors } = system;

  const fsa = oriAction(spec, origin);

  if (origin !== 'swagger-editor' && editorSelectors.selectContent() !== spec) {
    editorActions.setContent(spec);
  }

  return fsa;
};
