class Disposable extends Array {
  dispose() {
    this.forEach((disposable) => disposable.dispose());
    this.length = 0;
  }
}

const lazyMonacoContribution = ({ system }) => {
  const { fn, editorPreviewAsyncAPISelectors, editorSelectors, monaco } = system;
  const disposables = new Disposable();

  disposables.push(
    fn.registerMarkerDataProvider('apidom', {
      owner: 'asyncapi-parser',
      async provideMarkerData(model) {
        const modelValue = model.getValue();
        const modelVersionId = model.getVersionId();
        const conditionFn = () =>
          editorSelectors.selectIsContentTypeAsyncAPI2() &&
          modelValue === editorSelectors.selectContent() &&
          !editorPreviewAsyncAPISelectors.selectIsParseInProgress();

        try {
          // wait until proper content type has been detected and parsing has finished
          await fn.waitUntil(conditionFn);

          if (editorPreviewAsyncAPISelectors.selectIsParseSuccess()) return [];

          return editorPreviewAsyncAPISelectors.selectParseMarkers({ monaco, modelVersionId });
        } catch (e) {
          return [];
        }
      },
    })
  );

  // disposing of all allocated disposables
  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        editor.onDidDispose(() => {
          disposables.forEach((disposable) => {
            disposable.dispose();
          });
          disposables.length = 0;
        })
      );
    })
  );

  return disposables;
};

export default lazyMonacoContribution;
