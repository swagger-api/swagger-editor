import React from 'react';
import PropTypes from 'prop-types';

const TextareaEditorPane = ({ specActions, specSelectors, editorSelectors }) => {
  const spec = specSelectors.specStr() || '';
  const isReadOnly = editorSelectors.selectEditorIsReadyOnly();

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
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.shape({
    selectEditorIsReadyOnly: PropTypes.func,
  }),
};

TextareaEditorPane.defaultProps = {
  editorSelectors: {
    selectEditorIsReadyOnly: () => false,
  },
};

export default TextareaEditorPane;
