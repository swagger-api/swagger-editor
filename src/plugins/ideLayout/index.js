import TopbarPlugin from '../topbar';
import IdeLayout from './components/IdeLayout';
// import TopbarPlugin from './components/Topbar'; // todo: proposal to use component directly, w/o plugin
import EditorPane from '../../components/EditorPane';
import EditorTextArea from '../../components/EditorTextArea';
import SplitPaneMode from '../../components/SplitPaneMode';

const IdeLayoutPlugin = () => {
  return {
    components: {
      IdeLayout,
      EditorPane,
      EditorTextArea,
      SplitPaneMode,
      // Topbar,
    },
    // statePlugins: {
    //   ide: {},
    // },
    // wrapComponents: {},
  };
};

// load into swagger-ui as a 'preset' collection of plugins
export default function ideLayoutPreset() {
  return [IdeLayoutPlugin, TopbarPlugin];
}
