import MonacoEditorContainer from './components/MonacoEditorContainer';

export default function EditorPlugin() {
  return [
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
