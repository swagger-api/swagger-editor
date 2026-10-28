import React from 'react';
import PropTypes from 'prop-types';

import { isContentTypeRenderedBySwaggerUI } from '../../../fn.js';

const EditorPreviewWrapper = (Original, system) => {
  const EditorPreview = ({ getComponent, editorSelectors }) => {
    const EditorPreviewSwaggerUI = getComponent('EditorPreviewSwaggerUI', true);

    if (isContentTypeRenderedBySwaggerUI(editorSelectors)) {
      return <EditorPreviewSwaggerUI />;
    }

    return (
      <Original {...system} /> // eslint-disable-line react/jsx-props-no-spreading
    );
  };

  EditorPreview.propTypes = {
    getComponent: PropTypes.func.isRequired,
    editorSelectors: PropTypes.shape({
      selectIsContentTypeOpenAPI: PropTypes.func.isRequired,
      selectIsContentTypeOpenAPI31x: PropTypes.func.isRequired,
      selectIsContentTypeOpenAPI32x: PropTypes.func.isRequired,
      selectIsContentTypeJSONSchema202012: PropTypes.func.isRequired,
    }).isRequired,
  };

  return EditorPreview;
};

export default EditorPreviewWrapper;
