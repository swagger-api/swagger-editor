import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// @TODO(vladimir.gorej@gmail.com): this can be replaced by React.useId in React@18
import { useId } from '../../hooks.js';

const TextareaEditor = ({ isReadOnly, editorActions, editorSelectors, useEditorLifecycle }) => {
  const content = editorSelectors.selectContent();
  const id = useId();
  const editorRef = useEditorLifecycle('textarea');
  const [value, setValue] = useState(content);

  const handleChange = useCallback(
    (e) => {
      e.preventDefault();
      setValue(e.target.value);
      editorActions.setContentDebounced(e.target.value, 'editor');
    },
    [editorActions]
  );

  useEffect(() => {
    setValue(content);
  }, [content]);

  return (
    <textarea
      id={id}
      ref={editorRef}
      readOnly={isReadOnly}
      className="swagger-editor__editor-textarea"
      name="content"
      value={value}
      onChange={handleChange}
    />
  );
};

TextareaEditor.propTypes = {
  isReadOnly: PropTypes.bool,
  editorActions: PropTypes.shape({
    setContentDebounced: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
  }).isRequired,
  useEditorLifecycle: PropTypes.func.isRequired,
};

TextareaEditor.defaultProps = {
  isReadOnly: false,
};

export default TextareaEditor;
