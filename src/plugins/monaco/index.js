import EditorPane from './components/EditorPane.jsx';

const EDITOR_UPDATE_THEME = 'editor_update_theme';

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
        },
        reducers: {
          [EDITOR_UPDATE_THEME]: (state, action) => {
            return state.set('editorTheme', action.payload);
          },
        },
        selectors: {
          getEditorTheme: (state) => {
            return state.get('editorTheme');
          },
        },
      },
    },
  };
}
