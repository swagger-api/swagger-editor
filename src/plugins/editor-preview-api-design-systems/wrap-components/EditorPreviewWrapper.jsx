import React from 'react';
import PropTypes from 'prop-types';

const EditorPreviewWrapper = (Original, system) => {
  const EditorPreview = ({ editorSelectors, getComponent }) => {
    const EditorPreviewAPIDesignSystems = getComponent('EditorPreviewAPIDesignSystems', true);

    return editorSelectors.selectIsContentTypeAPIDesignSystems() ? (
      <EditorPreviewAPIDesignSystems />
    ) : (
      <Original {...system} /> // eslint-disable-line react/jsx-props-no-spreading
    );
  };

  EditorPreview.propTypes = {
    editorSelectors: PropTypes.oneOfType([
      PropTypes.shape({
        selectIsContentTypeAPIDesignSystems: PropTypes.func.isRequired,
      }),
    ]).isRequired,
    getComponent: PropTypes.func.isRequired,
  };

  return EditorPreview;
};

export default EditorPreviewWrapper;
