import { useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const LoadExampleNestedMenuHandler = forwardRef((props, ref) => {
  const { editorActions, editorContentFixturesSelectors } = props;

  useImperativeHandle(ref, () => ({
    loadOpenAP31PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI310PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadOpenAP30PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI303PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadOpenAP20PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI20PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAsyncAPI26PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI260PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAsyncAPI30PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI300PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAsyncAPI26StreetlightsFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI260StreetlightsYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAsyncAPI30StreetlightsFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI300StreetlightsYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAPIDesignSystemsFixture() {
      const content = editorContentFixturesSelectors.selectAPIDesignSystemsYAML();
      editorActions.setContent(content, 'fixture-load');
    },
  }));

  return null;
});

LoadExampleNestedMenuHandler.propTypes = {
  editorActions: PropTypes.shape({
    setContent: PropTypes.func.isRequired,
  }).isRequired,
  editorContentFixturesSelectors: PropTypes.shape({
    selectOpenAPI310PetstoreYAML: PropTypes.func.isRequired,
    selectOpenAPI303PetstoreYAML: PropTypes.func.isRequired,
    selectOpenAPI20PetstoreYAML: PropTypes.func.isRequired,
    selectAsyncAPI260PetstoreYAML: PropTypes.func.isRequired,
    selectAsyncAPI300PetstoreYAML: PropTypes.func.isRequired,
    selectAsyncAPI260StreetlightsYAML: PropTypes.func.isRequired,
    selectAsyncAPI300StreetlightsYAML: PropTypes.func.isRequired,
    selectAPIDesignSystemsYAML: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoadExampleNestedMenuHandler;
