const afterLoad = (system) => {
  const { editorContentFixturesSelectors, editorActions, EditorContentOrigin } = system;
  const definitionUrl =
    typeof process.env.REACT_APP_DEFINITION_URL === 'string'
      ? process.env.REACT_APP_DEFINITION_URL.trim()
      : '';
  const definitionFile =
    typeof process.env.REACT_APP_DEFINITION_FILE === 'string'
      ? process.env.REACT_APP_DEFINITION_FILE.trim()
      : '';

  if (definitionUrl) {
    editorActions.importUrl(definitionUrl);
    return;
  }

  if (definitionFile) {
    editorActions.importUrl(definitionFile);
    return;
  }

  const contentFixture = editorContentFixturesSelectors.selectAsyncAPI260StreetlightsYAML();

  editorActions.setContent(contentFixture, EditorContentOrigin.InitialFixtureLoad);
};

export default afterLoad;
