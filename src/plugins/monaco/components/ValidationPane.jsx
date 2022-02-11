import React from 'react';
import PropTypes from 'prop-types';

import noop from '../../../utils/common-noop.js';

const ValidationPane = (props) => {
  const { editorSelectors, onValidationKeyClick } = props;

  const markers = editorSelectors.getEditorMarkers();

  return (
    <div className="validation-pane">
      {markers.map((marker) => {
        return (
          <div
            key={marker.code}
            role="button"
            tabIndex={0}
            onClick={() => onValidationKeyClick(marker)}
            onKeyPress={() => onValidationKeyClick(marker)}
          >
            <span>Line: {marker.startColumn}</span>
            <span>Description: {marker.message}</span>
          </div>
        );
      })}
    </div>
  );
};

ValidationPane.propTypes = {
  onValidationKeyClick: PropTypes.func,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

ValidationPane.defaultProps = {
  onValidationKeyClick: noop,
};

export default ValidationPane;
