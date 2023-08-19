import React from 'react';
import PropTypes from 'prop-types';

const OnlineValidatorBadgeWrapper = (Original) => {
  const OnlineValidatorBadge = (props) => {
    const { editorSelectors } = props;

    if (!editorSelectors.selectIsContentTypeOpenAPI()) {
      return null;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Original {...props} />;
  };

  OnlineValidatorBadge.propTypes = {
    editorSelectors: PropTypes.shape({
      selectIsContentTypeOpenAPI: PropTypes.func.isRequired,
    }).isRequired,
  };

  return OnlineValidatorBadge;
};

export default OnlineValidatorBadgeWrapper;
