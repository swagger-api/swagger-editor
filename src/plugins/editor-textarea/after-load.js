const afterLoad = (system) => {
  const { editorContentFixturesSelectors, editorActions, EditorContentOrigin } = system;

  const contentFixture = editorContentFixturesSelectors.selectAsyncAPI260StreetlightsYAML();

  editorActions.setContent(contentFixture, EditorContentOrigin.InitialFixtureLoad);
};

export default afterLoad;
