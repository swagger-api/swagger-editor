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
    loadAsyncAPI25PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI250PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAsyncAPI25StreetlightsFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI250StreetlightsYAML();
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
    selectAsyncAPI250PetstoreYAML: PropTypes.func.isRequired,
    selectAsyncAPI250StreetlightsYAML: PropTypes.func.isRequired,
    selectAPIDesignSystemsYAML: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoadExampleNestedMenuHandler;
