import EditorPane from './components/EditorPane';

export default function MonacoEditorPlugin() {
  return {
    components: {
      EditorPane,
    },
    wrapComponents: {
      EditorPane,
    },
  };
}
