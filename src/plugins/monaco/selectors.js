import { createSelector } from 'reselect';

export const getEditorTheme = (state) => {
  return createSelector(() => {
    return state.get('editorTheme') || '';
  });
};

export const getEditorMarkers = (state) => {
  return createSelector(() => {
    return state.get('editorMarkers') || [];
  });
};

export const getEditorJumpToMarker = (state) => {
  return createSelector(() => {
    return state.get('editorJumpToMarker') || {};
  });
};
