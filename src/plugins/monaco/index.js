// This is the MonacoEditorPlugin
import EditorSpecOriginPlugin from '../editorSpecOrigin';
// // import MonacoEditor from './monacoEditor';
import MonacoEditorContainer from './components/MonacoEditorContainer';
// import * as actions from './actions';
// import reducers from './reducers';
// import * as selectors from './selectors';

/**
 * components may replace MonacoEditor with two components:
 * Expect may need a "makeEditor" with "editorPluginsToRun"
 * Expect may need a "MonacoContainer" that will contain the MonacoEditor
 */

export default function EditorPlugin() {
  return [
    EditorSpecOriginPlugin,
    {
      components: { MonacoEditorContainer },
      // statePlugins: {
      //   editor: {
      //     reducers,
      //     actions,
      //     selectors,
      //   },
      // },
    },
  ];
}
