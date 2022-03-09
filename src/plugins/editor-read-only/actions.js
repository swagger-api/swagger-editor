export const EDITOR_UPDATE_READ_ONLY = 'editor_update_read_only';

export const updateEditorIsReadOnly = (isReadOnly = false) => ({
  payload: isReadOnly,
  type: EDITOR_UPDATE_READ_ONLY,
});
