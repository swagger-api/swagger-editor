import EditorPane from './components/EditorPane';

export default function monacoEditorPlugin() {
  return {
    components: {
      EditorPane,
    },
    wrapComponents: {
      EditorPane,
    },
  };
}
