import EditorWorkspace from './components/EditorWorkspace';

export default function MonacoEditorWorkspacePlugin() {
  return [
    {
      components: { EditorWorkspace },
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
