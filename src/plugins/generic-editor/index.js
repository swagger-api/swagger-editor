import EditorLayout from './layout';
import EditorPlugin from '../monaco';
import SplitPaneModePlugin from '../split-pane-mode';

const GenericEditorPlugin = () => {
  return {
    statePlugin: {
      genericEditor: {},
    },
    components: {
      EditorLayout,
    },
  };
};

// should load into swagger-ui as a 'preset'
export default function genericEditorPreset() {
  return [GenericEditorPlugin, EditorPlugin, SplitPaneModePlugin];
}
