import React from 'react';
import PropTypes from 'prop-types';

const EditorPreviewWrapper = (Original, system) => {
  const EditorPreview = ({ getComponent, editorSelectors }) => {
    const EditorPreviewAsyncAPI = getComponent('EditorPreviewAsyncAPI', true);

    return editorSelectors.selectIsContentTypeAsyncAPI2() ? (
      <EditorPreviewAsyncAPI />
    ) : (
      <Original {...system} /> // eslint-disable-line react/jsx-props-no-spreading
    );
  };

  EditorPreview.propTypes = {
    getComponent: PropTypes.func.isRequired,
    editorSelectors: PropTypes.shape({
      selectIsContentTypeAsyncAPI2: PropTypes.func.isRequired,
    }).isRequired,
  };

  return EditorPreview;
};

export default EditorPreviewWrapper;
