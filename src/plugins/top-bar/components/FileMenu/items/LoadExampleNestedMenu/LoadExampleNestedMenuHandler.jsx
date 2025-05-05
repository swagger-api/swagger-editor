import { useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const LoadExampleNestedMenuHandler = forwardRef((props, ref) => {
  const { EditorContentOrigin, editorActions, editorContentFixturesSelectors } = props;

  useImperativeHandle(ref, () => ({
    loadOpenAP31PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI310PetstoreYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadOpenAP30PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI304PetstoreYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadOpenAP20PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI20PetstoreYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadAsyncAPI26PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI260PetstoreYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadAsyncAPI30PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI300PetstoreYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadAsyncAPI26StreetlightsFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI260StreetlightsYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadAsyncAPI30StreetlightsFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI300StreetlightsYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadJSONSchema202012Fixture() {
      const content = editorContentFixturesSelectors.selectJSONSchema202012YAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
    loadAPIDesignSystemsFixture() {
      const content = editorContentFixturesSelectors.selectAPIDesignSystemsYAML();
      editorActions.setContent(content, EditorContentOrigin.FixtureLoad);
    },
  }));

  return null;
});

LoadExampleNestedMenuHandler.propTypes = {
  EditorContentOrigin: PropTypes.shape({
    FixtureLoad: PropTypes.string.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    setContent: PropTypes.func.isRequired,
  }).isRequired,
  editorContentFixturesSelectors: PropTypes.shape({
    selectOpenAPI310PetstoreYAML: PropTypes.func.isRequired,
    selectOpenAPI304PetstoreYAML: PropTypes.func.isRequired,
    selectOpenAPI20PetstoreYAML: PropTypes.func.isRequired,
    selectAsyncAPI260PetstoreYAML: PropTypes.func.isRequired,
    selectAsyncAPI300PetstoreYAML: PropTypes.func.isRequired,
    selectAsyncAPI260StreetlightsYAML: PropTypes.func.isRequired,
    selectAsyncAPI300StreetlightsYAML: PropTypes.func.isRequired,
    selectJSONSchema202012YAML: PropTypes.func.isRequired,
    selectAPIDesignSystemsYAML: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoadExampleNestedMenuHandler;
