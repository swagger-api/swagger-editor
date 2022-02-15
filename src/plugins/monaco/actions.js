export const EDITOR_UPDATE_THEME = 'editor_update_theme';
export const EDITOR_ERROR_MARKERS = 'editor_error_markers';
export const EDITOR_JUMP_TO_EDITOR_MARKER = 'editor_jump_to_editor_marker';
export const EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER = 'editor_clear_jump_to_editor_marker';

export const updateEditorTheme = (theme = 'my-vs-dark') => {
  return {
    payload: theme,
    type: EDITOR_UPDATE_THEME,
  };
};
export const updateEditorMarkers = (markers = []) => {
  return {
    payload: markers,
    type: EDITOR_ERROR_MARKERS,
  };
};
export const setJumpToEditorMarker = (marker = {}) => {
  return {
    payload: marker,
    type: EDITOR_JUMP_TO_EDITOR_MARKER,
  };
};
export const clearJumpToEditorMarker = () => {
  return {
    payload: {},
    type: EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER,
  };
};
