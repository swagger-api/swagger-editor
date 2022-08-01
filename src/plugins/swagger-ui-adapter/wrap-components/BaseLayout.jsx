import React from 'react';
import PropTypes from 'prop-types';

const BaseLayoutWrapper = (Original, system) => {
  const BaseLayout = ({ getComponent, editorSelectors }) => {
    const EditorPreviewAsyncAPI = getComponent('EditorPreviewAsyncAPI', true);
    const EditorPreviewAPIDesignSystems = getComponent('EditorPreviewAPIDesignSystems', true);

    if (editorSelectors.selectIsContentTypeDetectionInProgress()) {
      return (
        <div className="swagger-ui swagger-container">
          <div className="swagger-ui">
            <div className="info">
              <div className="loading-container">
                <div className="loading" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (editorSelectors.selectIsContentTypeAsyncAPI2()) {
      return <EditorPreviewAsyncAPI />;
    }

    if (editorSelectors.selectIsContentTypeAPIDesignSystems()) {
      return <EditorPreviewAPIDesignSystems />;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Original {...system} />;
  };

  BaseLayout.propTypes = {
    getComponent: PropTypes.func.isRequired,
    editorSelectors: PropTypes.shape({
      selectIsContentTypeDetectionInProgress: PropTypes.func.isRequired,
      selectIsContentTypeAsyncAPI2: PropTypes.func.isRequired,
      selectIsContentTypeAPIDesignSystems: PropTypes.func.isRequired,
      selectIsContentTypeOpenAPI: PropTypes.func.isRequired,
      selectContentType: PropTypes.func.isRequired,
    }).isRequired,
  };

  return BaseLayout;
};

export default BaseLayoutWrapper;
