import React from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from './MonacoEditor.jsx';

const MonacoEditorContainer = ({
  editorActions,
  specActions,
  editorSelectors,
  specSelectors,
  isReadOnly,
  width,
  height,
}) => {
  const language = 'apidom';
  const initialValue = '';
  const defaultEditorTheme = 'my-vs-dark';

  const theme = editorSelectors.selectEditorTheme() || defaultEditorTheme;
  const jumpToMarker = editorSelectors.selectEditorJumpToMarker();
  const valueForEditor = specSelectors.specStr() || '';

  const handleEditorDidMount = (editor) => {
    editor.focus();
    editorActions.editorSetup(editor, 'monaco');
  };

  const handleEditorWillUnmount = (editor) => {
    editorActions.editorTearDown(editor, 'monaco');
  };

  const handleChangeEditorValue = (val) => {
    // no additional spec validation here
    // let ui components handle their own spec validation for rendering purposes
    specActions.updateSpec(val, 'editor');
  };

  const handleEditorMarkersDidChange = (markers) => {
    editorActions.updateEditorMarkers(markers);
  };

  const handleClearJumpToEditorMarker = async () => {
    editorActions.clearJumpToEditorMarker();
  };

  return (
    <MonacoEditor
      language={language}
      theme={theme}
      value={valueForEditor}
      defaultValue={initialValue}
      isReadOnly={isReadOnly}
      jumpToMarker={jumpToMarker}
      onChange={handleChangeEditorValue}
      height={height}
      width={width}
      onEditorMount={handleEditorDidMount}
      onEditorWillUnmount={handleEditorWillUnmount}
      editorMarkersDidChange={handleEditorMarkersDidChange}
      clearJumpToMarker={handleClearJumpToEditorMarker}
    />
  );
};

MonacoEditorContainer.propTypes = {
  isReadOnly: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

MonacoEditorContainer.defaultProps = {
  isReadOnly: false,
};

export default MonacoEditorContainer;
