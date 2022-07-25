import { createSelector } from 'reselect';

export const selectEditorTheme = (state) => state.get('editorTheme') || 'my-vs-dark';

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

export const selectEditorRequestJumpToMarker = (state) => state.get('editorRequestJumpToMarker');
