export const EDITOR_SETUP = 'editor_setup';
export const EDITOR_TEAR_DOWN = 'editor_tear_down';
export const EDITOR_SET_CONTENT = 'editor_set_content';
export const EDITOR_CLEAR_CONTENT = 'editor_clear_content';

export const editorSetup = (editorInstance, implementation = 'textarea') => ({
  type: EDITOR_SETUP,
  payload: editorInstance,
  meta: ['editor', implementation],
});

export const editorTearDown = (editorInstance, implementation = 'textarea') => ({
  type: EDITOR_TEAR_DOWN,
  payload: editorInstance,
  meta: ['editor', implementation],
});

export const setContent = (content) => ({
  type: EDITOR_SET_CONTENT,
  payload: content,
  meta: {},
});

export const clearContent = () => ({
  type: EDITOR_CLEAR_CONTENT,
});
