import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from './MonacoEditor.jsx';

class MonacoEditorContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      language: 'apidom',
      initialValue: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  handleEditorDidMount = (editor) => {
    editor.focus();
  };

  handleChangeEditorValue = (val) => {
    const { specActions } = this.props;
    // no additional spec validation here
    // let ui components handle their own spec validation for rendering purposes
    specActions.updateSpec(val, 'editor');
  };

  handleEditorMarkersDidChange = (markers) => {
    const { editorActions } = this.props;
    editorActions.updateEditorMarkers(markers); // if this fires, we see the issue
  };

  handleClearJumpToEditorMarker = async () => {
    const { editorActions } = this.props;
    editorActions.clearJumpToEditorMarker();
  };

  render() {
    const { initialValue, language } = this.state;
    const { isReadOnly, editorSelectors, specSelectors, width, height } = this.props;
    const defaultEditorTheme = 'my-vs-dark';
    const theme = editorSelectors.selectEditorTheme() || defaultEditorTheme;
    const jumpToMarker = editorSelectors.selectEditorJumpToMarker();
    const valueForEditor = specSelectors.specStr() || '';

    return (
      <MonacoEditor
        language={language}
        theme={theme}
        value={valueForEditor}
        defaultValue={initialValue}
        isReadOnly={isReadOnly}
        jumpToMarker={jumpToMarker}
        onChange={this.handleChangeEditorValue}
        height={height}
        width={width}
        editorDidMount={this.handleEditorDidMount}
        editorMarkersDidChange={this.handleEditorMarkersDidChange}
        clearJumpToMarker={this.handleClearJumpToEditorMarker}
      />
    );
  }
}

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
