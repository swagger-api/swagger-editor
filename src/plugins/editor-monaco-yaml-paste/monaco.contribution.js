const lazyMonacoContribution = ({ system }) => {
  const { editorMonacoYAMLPasteActions, monaco } = system;
  const disposables = [];

  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        editor.onDidPaste((event) => {
          const text = editor.getModel().getValueInRange(event.range);
          editorMonacoYAMLPasteActions.openTransformDialog({ text, range: event.range });
        })
      );
    })
  );

  // disposing of all allocated disposables
  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        editor.onDidDispose(() => {
          disposables.forEach((disposable) => disposable.dispose());
          disposables.length = 0;
        })
      );
    })
  );

  return disposables;
};

export default lazyMonacoContribution;
