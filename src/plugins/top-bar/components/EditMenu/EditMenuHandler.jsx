import { useImperativeHandle, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';

import ConvertToJSONMenuItemHandler from './items/ConvertToJSONMenuItemHandler.jsx';
import ConvertToYAMLMenuItemHandler from './items/ConvertToYAMLMenuItemHandler.jsx';
import CovertToOpenAPI30xMenuItemHandler from './items/ConvertToOpenAPI30xMenuItemHandler.jsx';

/* eslint-disable react/jsx-props-no-spreading */

const EditMenuHandler = forwardRef((props, ref) => {
  const { editorActions, editorContentFixturesSelectors } = props;
  const convertToJSONMenuItemHandler = useRef(null);
  const convertToYAMLMenuItemHandler = useRef(null);
  const convertToOpenAPI30xMenuItemHandler = useRef(null);

  useImperativeHandle(ref, () => ({
    clear() {
      editorActions.clearContent();
    },
    async convertToJSON() {
      await convertToJSONMenuItemHandler.current.convertToJSON();
    },
    async convertToYAML() {
      await convertToYAMLMenuItemHandler.current.convertToYAML();
    },
    async convertOpenAPI20ToOpenAPI30xClick() {
      await convertToOpenAPI30xMenuItemHandler.current.convert();
    },
    async loadOpenAPI20Fixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI20JSON();
      const fsa = await editorActions.convertContentToYAML(content);

      if (!fsa.error) {
        editorActions.setContent(fsa.payload, 'fixture-load');
      }
    },
    async loadOpenAPI30Fixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI303JSON();
      const fsa = await editorActions.convertContentToYAML(content);

      if (!fsa.error) {
        editorActions.setContent(fsa.payload, 'fixture-load');
      }
    },
    async loadOpenAPI20PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI20PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    async loadOpenAPI30PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI30PetstoreYAML();
      editorActions.setContent(content, 'fixture-load');
    },
    async loadOpenAPI31Fixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI310JSON();
      const fsa = await editorActions.convertContentToYAML(content);

      if (!fsa.error) {
        editorActions.setContent(fsa.payload, 'fixture-load');
      }
    },
    async loadAsyncAPI24Fixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI250JSON();
      const fsa = await editorActions.convertContentToYAML(content);

      if (!fsa.error) {
        editorActions.setContent(fsa.payload, 'fixture-load');
      }
    },
    loadAsyncAPI24PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI250PetstoreJSON();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAPIDesignSystemsFixture() {
      const content = editorContentFixturesSelectors.selectAPIDesignSystemsJSON();
      editorActions.setContent(content, 'fixture-load');
    },
  }));

  return (
    <>
      <ConvertToJSONMenuItemHandler ref={convertToJSONMenuItemHandler} {...props} />
      <ConvertToYAMLMenuItemHandler ref={convertToYAMLMenuItemHandler} {...props} />
      <CovertToOpenAPI30xMenuItemHandler ref={convertToOpenAPI30xMenuItemHandler} {...props} />
    </>
  );
});

EditMenuHandler.propTypes = {
  editorActions: PropTypes.shape({
    clearContent: PropTypes.func.isRequired,
    convertContentToYAML: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
  }).isRequired,
  editorContentFixturesSelectors: PropTypes.shape({
    selectOpenAPI20JSON: PropTypes.func.isRequired,
    selectOpenAPI303JSON: PropTypes.func.isRequired,
    selectOpenAPI310JSON: PropTypes.func.isRequired,
    selectAsyncAPI250JSON: PropTypes.func.isRequired,
    selectAsyncAPI250PetstoreJSON: PropTypes.func.isRequired,
    selectAPIDesignSystemsJSON: PropTypes.func.isRequired,
    selectOpenAPI20PetstoreYAML: PropTypes.func.isRequired,
    selectOpenAPI30PetstoreYAML: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditMenuHandler;
