import React from 'react';
import PropTypes from 'prop-types';

const TextareaEditorPane = ({ specActions, specSelectors }) => {
  const spec = specSelectors.specStr() || '';

  const handleChange = (e) => {
    e.preventDefault();
    specActions.updateSpec(e.target.value);
  };

  return <textarea className="editor-pane" name="spec" value={spec} onChange={handleChange} />;
};

TextareaEditorPane.propTypes = {
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default TextareaEditorPane;
