// MonacoEditorPlugin will override with its own 'EditorTextArea'
// for now, treat this plugin as the team's 'idePlugin'
// EditorPane is the container for 3 pane editor+controls
// EditorTextArea is the actual editor, to which we want two versions of, 'textarea' and 'monaco'
import EditorPane from '../../components/EditorPane';
import EditorTextArea from '../../components/EditorTextArea';
// import EditorPanelValidation from './components/EditorPanelValidation'; // NYI: future feature
// import EditorToolbarThemes from './components/EditorToolbarThemes'; // NYI: future feature

const EditorPanePlugin = () => {
  return {
    components: {
      EditorPane,
      EditorTextArea,
      // EditorPanelValidation,
      // EditorToolbarThemes,
    },
    // statePlugin: {
    //   ide: {},
    // },
    // wrapComponents: {},
  };
};

// load into swagger-ui as a 'preset' collection of plugins
export default function editorPanePreset() {
  return [EditorPanePlugin];
}
