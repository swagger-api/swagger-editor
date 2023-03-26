import { fromJS, List } from 'immutable';

import {
  EDITOR_UPDATE_THEME,
  EDITOR_SET_MARKERS,
  EDITOR_CLEAR_MARKERS,
  EDITOR_APPEND_MARKERS,
  EDITOR_JUMP_TO_EDITOR_MARKER,
  EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER,
  EDITOR_SET_REQUEST_JUMP_TO_EDITOR_MARKER,
  EDITOR_CLEAR_REQUEST_JUMP_TO_EDITOR_MARKER,
  EDITOR_SET_LANGUAGE,
} from './actions.js';

const reducers = {
  [EDITOR_UPDATE_THEME]: (state, action) => {
    return state.set('editorTheme', action.payload);
  },
  [EDITOR_SET_MARKERS]: (state, action) => {
    return state.set('markers', fromJS(action.payload));
  },
  [EDITOR_APPEND_MARKERS]: (state, action) => {
    const markers = state.get('markers', List());
    return state.set('markers', markers.concat(fromJS(action.payload)));
  },
  [EDITOR_CLEAR_MARKERS]: (state, action) => {
    const { payload: source } = action;
    const markers = state
      .get('markers', List())
      .filterNot((marker) => marker.get('source') === source);
    return state.set('markers', markers);
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
  [EDITOR_SET_LANGUAGE]: (state, action) => {
    return state.set('editorLanguage', action.payload);
  },
};

export default reducers;
