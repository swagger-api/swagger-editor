import PropTypes from 'prop-types';

const TextareaEditor = ({ isReadOnly, specActions, specSelectors, useEditorLifecycle }) => {
  const spec = specSelectors.specStr() || '';
  const handleChange = (e) => {
    e.preventDefault();
    specActions.updateSpec(e.target.value, 'editor');
  };
  const editorRef = useEditorLifecycle('textarea');

  return (
    <textarea
      ref={editorRef}
      readOnly={isReadOnly}
      className="swagger-editor__editor-textarea"
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
  useEditorLifecycle: PropTypes.func.isRequired,
};

TextareaEditor.defaultProps = {
  isReadOnly: false,
};

export default TextareaEditor;
