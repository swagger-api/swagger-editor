export const EDITOR_SETUP = 'editor_setup';
export const EDITOR_TEAR_DOWN = 'editor_tear_down';

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
