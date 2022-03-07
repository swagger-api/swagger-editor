import ReadOnlySelectionIcon from './components/ReadOnlySelectionIcon.jsx';

const EDITOR_UPDATE_READ_ONLY = 'editor_update_read_only';

const EditorReadOnlyPlugin = () => {
  return {
    components: {
      ReadOnlySelection: ReadOnlySelectionIcon,
    },
    statePlugins: {
      editor: {
        reducers: {
          [EDITOR_UPDATE_READ_ONLY]: (state, action) => {
            return state.set('editorIsReadOnly', action.payload);
          },
        },
        selectors: {
          getEditorIsReadyOnly: (state) => state.get('editorIsReadOnly') || 'false',
        },
        actions: {
          updateEditorIsReadOnly(isReadOnly = 'false') {
            return {
              payload: isReadOnly,
              type: EDITOR_UPDATE_READ_ONLY,
            };
          },
        },
      },
    },
  };
};

export default EditorReadOnlyPlugin;
