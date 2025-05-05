import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from './MonacoEditor.jsx';

const MonacoEditorContainer = ({
  editorActions,
  editorSelectors,
  isReadOnly = false,
  EditorContentOrigin,
}) => {
  const theme = editorSelectors.selectTheme();
  const value = editorSelectors.selectContent();
  const language = editorSelectors.selectLanguage();

  const handleEditorDidMount = useCallback(
    (editor) => {
      editor.focus();
      editorActions.editorSetup(editor, 'monaco');
    },
    [editorActions]
  );

  const handleEditorWillUnmount = useCallback(
    (editor) => {
      editorActions.editorTearDown(editor, 'monaco');
    },
    [editorActions]
  );

  const handleChangeEditorValue = useCallback(
    (newValue) => {
      editorActions.setContentDebounced(newValue, EditorContentOrigin.Editor);
    },
    [editorActions, EditorContentOrigin]
  );

  const handleEditorMarkersDidChange = useCallback(
    (markers) => {
      editorActions.setMarkers(markers);
    },
    [editorActions]
  );

  return (
    <MonacoEditor
      language={language}
      theme={theme}
      value={value}
      isReadOnly={isReadOnly}
      onChange={handleChangeEditorValue}
      onMount={handleEditorDidMount}
      onWillUnmount={handleEditorWillUnmount}
      onEditorMarkersDidChange={handleEditorMarkersDidChange}
    />
  );
};

MonacoEditorContainer.propTypes = {
  isReadOnly: PropTypes.bool,
  editorActions: PropTypes.shape({
    editorSetup: PropTypes.func.isRequired,
    editorTearDown: PropTypes.func.isRequired,
    setContentDebounced: PropTypes.func.isRequired,
    setMarkers: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectLanguage: PropTypes.func.isRequired,
    selectContent: PropTypes.func.isRequired,
    selectTheme: PropTypes.func.isRequired,
  }).isRequired,
  EditorContentOrigin: PropTypes.shape({
    Editor: PropTypes.string.isRequired,
  }).isRequired,
};

export default MonacoEditorContainer;
