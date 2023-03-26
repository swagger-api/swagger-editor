import { createSelector } from 'reselect';
import { List } from 'immutable';

export const selectEditorTheme = (state) => state.get('editorTheme') || 'my-vs-dark';

export const selectMarkers = createSelector(
  (state) => state.get('markers', List()),
  (markers) => markers.toJS()
);

export const selectEditorJumpToMarker = createSelector(
  (state) => state.get('editorJumpToMarker'),
  (editorJumpToMarker) => {
    return editorJumpToMarker || {};
  }
);

export const selectLanguage = (state) => state.get('editorLanguage', 'plaintext');

export const selectEditorRequestJumpToMarker = (state) => state.get('editorRequestJumpToMarker');
