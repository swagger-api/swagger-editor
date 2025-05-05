import React from 'react';
import PropTypes from 'prop-types';

const EditorPreviewWrapper = (Original, system) => {
  const EditorPreview = ({ getComponent, editorSelectors }) => {
    const EditorPreviewSwaggerUI = getComponent('EditorPreviewSwaggerUI', true);
    const isOpenAPI = editorSelectors.selectIsContentTypeOpenAPI();

    if (isOpenAPI) {
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
    }).isRequired,
  };

  return EditorPreview;
};

export default EditorPreviewWrapper;
