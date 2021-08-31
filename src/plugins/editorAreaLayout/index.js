// MonacoEditorPlugin will override with its own 'EditorWorkspace'
// for now, treat this plugin as the team's 'idePlugin'
// EditorAreaLayout is the container for 3 pane editor+controls
// EditorWorkspace is the actual editor, to which we want two versions of, 'textarea' and 'monaco'
import EditorAreaLayout from './components/EditorAreaLayout';
import EditorWorkspace from './components/EditorWorkspace';
// import EditorPanelValidation from './components/EditorPanelValidation'; // NYI: future feature
// import EditorToolbarThemes from './components/EditorToolbarThemes'; // NYI: future feature

const EditorAreaLayoutPlugin = () => {
  return {
    components: {
      EditorAreaLayout,
      EditorWorkspace,
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
export default function editorAreaLayoutPreset() {
  return [EditorAreaLayoutPlugin];
}
