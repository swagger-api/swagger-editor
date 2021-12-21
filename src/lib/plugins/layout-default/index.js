import { SplitPane } from 'react-collapse-pane';

import LayoutDefault from './components/LayoutDefault';
import EditorPane from '../../components/EditorPane';
import EditorTextArea from '../../components/EditorTextArea';
import Topbar from '../../components/Topbar';

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
