import React from 'react';
import PropTypes from 'prop-types';

const EditorPreviewWrapper = (Original, system) => {
  const EditorPreview = ({ getComponent, editorSelectors }) => {
    const EditorPreviewAsyncAPI = getComponent('EditorPreviewAsyncAPI', true);
    const isAsyncAPI = editorSelectors.selectIsContentTypeAsyncAPI();

    if (isAsyncAPI) {
      return <EditorPreviewAsyncAPI />;
    }

    return <Original {...system} />; // eslint-disable-line react/jsx-props-no-spreading
  };

  EditorPreview.propTypes = {
    getComponent: PropTypes.func.isRequired,
    editorSelectors: PropTypes.shape({
      selectIsContentTypeAsyncAPI: PropTypes.func.isRequired,
    }).isRequired,
  };

  return EditorPreview;
};

export default EditorPreviewWrapper;
