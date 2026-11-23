import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop.js';

import MonacoEditor from './MonacoEditor.jsx';

const MonacoEditorContainer = ({
  editorActions,
  editorSelectors,
  monacoInitializationDeferred,
  isReadOnly = false,
  bracketPairColorizationEnabled = false,
  EditorContentOrigin,
}) => {
  const [areServicesReady, setAreServicesReady] = useState(false);
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

  // editor must not be created before Monaco services are initialized
  useEffect(() => {
    let isActive = true;

    monacoInitializationDeferred()
      .promise.catch(noop)
      .then(() => {
        if (isActive) setAreServicesReady(true);
      });

    return () => {
      isActive = false;
    };
  }, [monacoInitializationDeferred]);

  if (!areServicesReady) return null;

  return (
    <MonacoEditor
      language={language}
      theme={theme}
      value={value}
      isReadOnly={isReadOnly}
      bracketPairColorizationEnabled={bracketPairColorizationEnabled}
      onChange={handleChangeEditorValue}
      onMount={handleEditorDidMount}
      onWillUnmount={handleEditorWillUnmount}
      onEditorMarkersDidChange={handleEditorMarkersDidChange}
    />
  );
};

MonacoEditorContainer.propTypes = {
  isReadOnly: PropTypes.bool,
  bracketPairColorizationEnabled: PropTypes.bool,
  editorActions: PropTypes.shape({
    editorSetup: PropTypes.func.isRequired,
    editorTearDown: PropTypes.func.isRequired,
    setContentDebounced: PropTypes.func.isRequired,
    setMarkers: PropTypes.func.isRequired,
  }).isRequired,
  monacoInitializationDeferred: PropTypes.func.isRequired,
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
