import EditorLayout from './GenericEditorLayout';
import MonacoEditorWorkspacePlugin from '../monaco';
import GenericEditorContainer from './components/GenericEditorContainer';
import EditorComponent from './components/EditorComponent';
import SplitPaneModePlugin from '../split-pane-mode';

const GenericEditorPlugin = () => {
  return {
    statePlugin: {
      genericEditor: {},
    },
    components: {
      EditorLayout,
      GenericEditorContainer,
      EditorComponent,
    },
    // wrapComponents: {},
  };
};

// should load into swagger-ui as a 'preset'
export default function genericEditorPreset() {
  return [GenericEditorPlugin, MonacoEditorWorkspacePlugin, SplitPaneModePlugin];
}
