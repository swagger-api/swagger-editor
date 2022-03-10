export const selectEditorTheme = (state) => state.get('editorTheme') || '';

export const selectEditorMarkers = (state) => state.get('editorMarkers') || [];

export const selectEditorJumpToMarker = (state) => state.get('editorJumpToMarker') || {};
