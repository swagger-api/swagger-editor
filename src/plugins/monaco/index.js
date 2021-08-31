// import MonacoEditorContainer from './components/MonacoEditorContainer';
import EditorWorkspace from './components/EditorWorkspace';

export default function MonacoEditorWorkspacePlugin() {
  return [
    {
      components: { EditorWorkspace }, // formerly 'MonacoEditorContainer'
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
