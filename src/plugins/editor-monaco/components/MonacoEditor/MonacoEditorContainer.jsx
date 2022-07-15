import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from './MonacoEditor.jsx';

const MonacoEditorContainer = ({
  editorActions,
  specActions,
  editorSelectors,
  specSelectors,
  isReadOnly,
}) => {
  const language = 'apidom';
  const theme = editorSelectors.selectEditorTheme() || 'my-vs-dark';
  const jumpToMarker = editorSelectors.selectEditorJumpToMarker();
  const requestJumpToMarker = editorSelectors.selectEditorRequestJumpToMarker();
  const value = specSelectors.specStr() || '';

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
    (val) => {
      specActions.updateSpec(val, 'editor');
    },
    [specActions]
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
      language={language}
      theme={theme}
      value={value}
      isReadOnly={isReadOnly}
      jumpToMarker={jumpToMarker}
      requestJumpToMarker={requestJumpToMarker}
      onChange={handleChangeEditorValue}
      onEditorMount={handleEditorDidMount}
      onEditorWillUnmount={handleEditorWillUnmount}
      onEditorMarkersDidChange={handleEditorMarkersDidChange}
      onClearJumpToMarker={handleClearJumpToEditorMarker}
      onSetRequestJumpToMarker={handleSetJumpToEditorMarker}
      onClearRequestJumpToMarker={handleClearRequestJumpToEditorMarker}
    />
  );
};

MonacoEditorContainer.propTypes = {
  isReadOnly: PropTypes.bool,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

MonacoEditorContainer.defaultProps = {
  isReadOnly: false,
};

export default MonacoEditorContainer;
