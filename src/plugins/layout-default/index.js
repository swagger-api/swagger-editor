import { SplitPane } from 'react-collapse-pane';

import LayoutDefault from './components/LayoutDefault.jsx';
import EditorPane from '../../components/EditorPane.jsx';
import EditorTextArea from '../../components/EditorTextArea.jsx';
import Topbar from '../../components/Topbar.jsx';

const LayoutDefaultPlugin = () => {
  return {
    components: {
      LayoutDefault,
      EditorPane,
      EditorTextArea,
      SplitPaneMode: SplitPane,
      Topbar,
    },
  };
};

// load into swagger-ui as a 'preset' collection of plugins
export default function layoutDefaultPreset() {
  return [LayoutDefaultPlugin];
}
