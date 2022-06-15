import React from 'react';
import PropTypes from 'prop-types';

const EditorPreviewPaneWrapper = (Original, system) => {
  const EditorPreviewPane = ({ adsSelectors, getComponent }) => {
    if (adsSelectors.selectIsAPIDesignSystemsSpec()) {
      const Main = getComponent('ADSMain', true);

      return <Main />;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Original {...system} />;
  };

  EditorPreviewPane.propTypes = {
    adsSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
    getComponent: PropTypes.func.isRequired,
  };

  return EditorPreviewPane;
};

export default EditorPreviewPaneWrapper;
