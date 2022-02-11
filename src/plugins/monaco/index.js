import EditorPane from './components/EditorPane.jsx';

const EDITOR_UPDATE_THEME = 'editor_update_theme';
const EDITOR_ERROR_MARKERS = 'editor_error_markers';
const EDITOR_JUMP_TO_EDITOR_MARKER = 'editor_jump_to_editor_marker';
const EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER = 'editor_clear_jump_to_editor_marker';

export default function monacoEditorPlugin() {
  return {
    components: {
      EditorPane,
    },
    wrapComponents: {
      EditorPane,
    },
    statePlugins: {
      editor: {
        actions: {
          updateEditorTheme(theme = 'my-vs-dark') {
            return {
              payload: theme,
              type: EDITOR_UPDATE_THEME,
            };
          },
          updateEditorMarkers(markers = []) {
            return {
              payload: markers,
              type: EDITOR_ERROR_MARKERS,
            };
          },
          setJumpToEditorMarker(marker = {}) {
            return {
              payload: marker,
              type: EDITOR_JUMP_TO_EDITOR_MARKER,
            };
          },
          clearJumpToEditorMarker() {
            return {
              payload: {},
              type: EDITOR_CLEAR_JUMP_TO_EDITOR_MARKER,
            };
          },
        },
        reducers: {
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
        },
        selectors: {
          getEditorTheme: (state) => {
            return state.get('editorTheme') || '';
          },
          getEditorMarkers: (state) => {
            return state.get('editorMarkers') || [];
          },
          getEditorJumpToMarker: (state) => {
            return state.get('editorJumpToMarker') || {};
          },
        },
      },
    },
  };
}
