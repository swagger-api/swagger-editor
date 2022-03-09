import React from 'react';
import PropTypes from 'prop-types';

const TextareaEditorPane = ({ isReadOnly, specActions, specSelectors }) => {
  const spec = specSelectors.specStr() || '';
  const handleChange = (e) => {
    e.preventDefault();
    specActions.updateSpec(e.target.value, 'editor');
  };

  return (
    <textarea
      readOnly={isReadOnly}
      className="editor-pane"
      name="spec"
      value={spec}
      onChange={handleChange}
    />
  );
};

TextareaEditorPane.propTypes = {
  isReadOnly: PropTypes.bool,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

TextareaEditorPane.defaultProps = {
  isReadOnly: false,
};

export default TextareaEditorPane;
