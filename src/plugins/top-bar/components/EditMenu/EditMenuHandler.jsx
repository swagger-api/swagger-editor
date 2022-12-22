import { useImperativeHandle, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';

import ConvertToJSONMenuItemHandler from './items/ConvertToJSONMenuItemHandler.jsx';
import ConvertToYAMLMenuItemHandler from './items/ConvertToYAMLMenuItemHandler.jsx';
import CovertToOpenAPI30xMenuItemHandler from './items/ConvertToOpenAPI30xMenuItemHandler.jsx';

/* eslint-disable react/jsx-props-no-spreading */

const EditMenuHandler = forwardRef((props, ref) => {
  const { editorActions } = props;
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
  editorContentFixturesSelectors: PropTypes.shape({}).isRequired,
};

export default EditMenuHandler;
