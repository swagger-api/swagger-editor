import React from 'react';
import PropTypes from 'prop-types';

const TextareaEditor = ({ isReadOnly, specActions, specSelectors }) => {
  const spec = specSelectors.specStr() || '';
  const handleChange = (e) => {
    e.preventDefault();
    specActions.updateSpec(e.target.value, 'editor');
  };

  return (
    <textarea
      readOnly={isReadOnly}
      className="swagger-ide__editor-textarea"
      name="spec"
      value={spec}
      onChange={handleChange}
    />
  );
};

TextareaEditor.propTypes = {
  isReadOnly: PropTypes.bool,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

TextareaEditor.defaultProps = {
  isReadOnly: false,
};

export default TextareaEditor;
