import { createSelector } from 'reselect';

export const selectEditorTheme = (state) => state.get('editorTheme') || '';

export const selectEditorMarkers = createSelector(
  (state) => state.get('editorMarkers'),
  (editorMarkers) => {
    return editorMarkers || [];
  }
);

export const selectEditorJumpToMarker = createSelector(
  (state) => state.get('editorJumpToMarker'),
  (editorJumpToMarker) => {
    return editorJumpToMarker || {};
  }
);
