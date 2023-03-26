export const EDITOR_UPDATE_THEME = 'editor_update_theme';

export const EDITOR_SET_MARKERS = 'editor_set_markers';
export const EDITOR_APPEND_MARKERS = 'editor_append_markers';
export const EDITOR_CLEAR_MARKERS = 'editor_clear_markers';

export const EDITOR_JUMP_TO_EDITOR_MARKER = 'editor_jump_to_editor_marker';
export const EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER = 'editor_clear_jump_to_editor_marker';
export const EDITOR_SET_REQUEST_JUMP_TO_EDITOR_MARKER = 'editor_set_request_jump_to_editor_marker';
export const EDITOR_CLEAR_REQUEST_JUMP_TO_EDITOR_MARKER =
  'editor_clear_request_jump_to_editor_marker';

export const EDITOR_SET_LANGUAGE = 'editor_set_language';

export const updateEditorTheme = (theme = 'my-vs-dark') => {
  return {
    payload: theme,
    type: EDITOR_UPDATE_THEME,
  };
};

export const setMarkers = (markers = []) => {
  return {
    type: EDITOR_SET_MARKERS,
    payload: markers,
  };
};
export const appendMarkers = (markers = []) => {
  return {
    type: EDITOR_APPEND_MARKERS,
    payload: markers,
  };
};

export const clearMarkers = (source = 'apilint') => {
  return {
    type: EDITOR_CLEAR_MARKERS,
    payload: source,
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
export const setRequestJumpToEditorMarker = (marker = {}) => {
  return {
    payload: marker,
    type: EDITOR_SET_REQUEST_JUMP_TO_EDITOR_MARKER,
  };
};
export const clearRequestJumpToEditorMarker = () => {
  return {
    payload: {},
    type: EDITOR_CLEAR_REQUEST_JUMP_TO_EDITOR_MARKER,
  };
};

export const setLanguage = (languageId) => {
  return {
    payload: languageId,
    type: EDITOR_SET_LANGUAGE,
  };
};
