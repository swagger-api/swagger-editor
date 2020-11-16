import GenericEditorLayout from 'plugin/layouts/GenericEditorLayout';

const GenericEditorPlugin = () => ({
  statePlugin: {
    genericEditor: {},
  },
  components: {
    GenericEditorLayout,
  },
});

export default GenericEditorPlugin;
