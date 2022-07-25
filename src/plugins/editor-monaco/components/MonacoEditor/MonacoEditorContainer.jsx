import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from './MonacoEditor.jsx';

const MonacoEditorContainer = ({ editorActions, editorSelectors, isReadOnly }) => {
  const theme = editorSelectors.selectEditorTheme();
  const jumpToMarker = editorSelectors.selectEditorJumpToMarker();
  const requestJumpToMarker = editorSelectors.selectEditorRequestJumpToMarker();
  const value = editorSelectors.selectContent();

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
      editorActions.setContentDebounced(newValue, 'editor');
    },
    [editorActions]
  );

  const handleEditorMarkersDidChange = useCallback(
    (markers) => {
      editorActions.updateEditorMarkers(markers);
    },
    [editorActions]
  );

  const handleClearJumpToEditorMarker = useCallback(() => {
    editorActions.clearJumpToEditorMarker();
  }, [editorActions]);

  const handleSetJumpToEditorMarker = useCallback(
    (marker) => {
      editorActions.setJumpToEditorMarker(marker);
    },
    [editorActions]
  );

  const handleClearRequestJumpToEditorMarker = useCallback(() => {
    editorActions.clearRequestJumpToEditorMarker();
  }, [editorActions]);

  return (
    <MonacoEditor
      language="apidom"
      theme={theme}
      value={value}
      isReadOnly={isReadOnly}
      jumpToMarker={jumpToMarker}
      requestJumpToMarker={requestJumpToMarker}
      onChange={handleChangeEditorValue}
      onMount={handleEditorDidMount}
      onWillUnmount={handleEditorWillUnmount}
      onEditorMarkersDidChange={handleEditorMarkersDidChange}
      onClearJumpToMarker={handleClearJumpToEditorMarker}
      onSetRequestJumpToMarker={handleSetJumpToEditorMarker}
      onClearRequestJumpToMarker={handleClearRequestJumpToEditorMarker}
    />
  );
};

MonacoEditorContainer.propTypes = {
  isReadOnly: PropTypes.bool,
  editorActions: PropTypes.shape({
    editorSetup: PropTypes.func.isRequired,
    editorTearDown: PropTypes.func.isRequired,
    setContentDebounced: PropTypes.func.isRequired,
    updateEditorMarkers: PropTypes.func.isRequired,
    clearJumpToEditorMarker: PropTypes.func.isRequired,
    setJumpToEditorMarker: PropTypes.func.isRequired,
    clearRequestJumpToEditorMarker: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectEditorTheme: PropTypes.func.isRequired,
    selectEditorJumpToMarker: PropTypes.func.isRequired,
    selectEditorRequestJumpToMarker: PropTypes.func.isRequired,
  }).isRequired,
};

MonacoEditorContainer.defaultProps = {
  isReadOnly: false,
};

export default MonacoEditorContainer;
