import {
  EDITOR_UPDATE_THEME,
  EDITOR_ERROR_MARKERS,
  EDITOR_JUMP_TO_EDITOR_MARKER,
  EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER,
  EDITOR_SET_REQUEST_JUMP_TO_EDITOR_MARKER,
  EDITOR_CLEAR_REQUEST_JUMP_TO_EDITOR_MARKER,
} from './actions.js';

const reducers = {
  [EDITOR_UPDATE_THEME]: (state, action) => {
    return state.set('editorTheme', action.payload);
  },
  [EDITOR_ERROR_MARKERS]: (state, action) => {
    return state.set('editorMarkers', action.payload);
  },
  [EDITOR_JUMP_TO_EDITOR_MARKER]: (state, action) => {
    return state.set('editorJumpToMarker', action.payload);
  },
  [EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER]: (state, action) => {
    return state.set('editorJumpToMarker', action.payload);
  },
  [EDITOR_SET_REQUEST_JUMP_TO_EDITOR_MARKER]: (state, action) => {
    return state.set('editorRequestJumpToMarker', action.payload);
  },
  [EDITOR_CLEAR_REQUEST_JUMP_TO_EDITOR_MARKER]: (state, action) => {
    return state.set('editorRequestJumpToMarker', action.payload);
  },
};

export default reducers;
