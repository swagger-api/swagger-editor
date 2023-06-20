const lazyMonacoContribution = ({ system }) => {
  const { fn, editorPreviewAsyncAPISelectors, editorSelectors, monaco } = system;
  const disposables = [];

  disposables.push(
    fn.registerMarkerDataProvider('apidom', {
      owner: 'asyncapi-parser',
      async provideMarkerData(model) {
        const content = model.getValue();
        const conditionFn = () =>
          editorSelectors.selectIsContentTypeAsyncAPI2() &&
          content === editorSelectors.selectContent() &&
          !editorPreviewAsyncAPISelectors.selectIsParseInProgress();

        try {
          // wait until proper content type has been detected and parsing has finished
          await fn.waitUntil(conditionFn);

          if (editorPreviewAsyncAPISelectors.selectIsParseSuccess()) return [];

          return editorPreviewAsyncAPISelectors.selectParseErrors().map((parseError) => ({
            ...parseError,
            code: `ASNCPRSR${model.getVersionId()}`,
            severity: monaco.MarkerSeverity.Error,
            source: '@asyncapi/parser',
            modelVersionId: model.getVersionId(),
          }));
        } catch {
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
          disposables.forEach((disposable) => disposable.dispose());
          disposables.length = 0;
        })
      );
    })
  );
};

export default lazyMonacoContribution;
