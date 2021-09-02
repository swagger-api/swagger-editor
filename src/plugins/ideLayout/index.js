import TopbarPlugin from '../topbar';
import SplitPaneModePlugin from '../split-pane-mode';
import EditorAreaLayoutPlugin from '../editorAreaLayout';
import MonacoEditorWorkspacePlugin from '../monaco';
import IdeLayout from './components/IdeLayout';
// import SplitPaneMode from './components/SplitPaneMode'; // todo: use component directly, w/o plugin
// import TopbarPlugin from './components/Topbar'; // todo: proposal to use component directly, w/o plugin

const IdeLayoutPlugin = () => {
  return {
    components: {
      IdeLayout,
      // Topbar,
      // SplitPaneMode,
    },
    // statePlugin: {
    //   ide: {},
    // },
    // wrapComponents: {},
  };
};

// load into swagger-ui as a 'preset' collection of plugins
export default function ideLayoutPreset() {
  return [
    IdeLayoutPlugin,
    TopbarPlugin,
    SplitPaneModePlugin,
    EditorAreaLayoutPlugin,
    MonacoEditorWorkspacePlugin,
  ];
}
