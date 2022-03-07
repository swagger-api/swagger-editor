import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import YAML from 'js-yaml';
import { isJsonDoc } from '@swagger-api/apidom-ls';

import MonacoEditor from './MonacoEditor.jsx';

// TODO: may want to update/replace { isJsonDoc }
// depending on if { isJsonDoc } also validates for both { isValidJson, isValidYaml }
// import { isValidJson, isValidYaml } from '../../../utils/spec-valid-json-yaml';

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
    // validate spec, if not valid increase delay
    /*
      TODO remove logic if underlying issue with error being raised by Swagger UI updatedSpec or related code gets solved.
     */
    try {
      if (isJsonDoc(val)) {
        JSON.parse(val);
      } else {
        YAML.load(val);
      }
      specActions.updateSpec(val);
    } catch (e) {
      // do nothing
    }
  };

  handleEditorMarkersDidChange = (markers) => {
    const { editorActions } = this.props;
    editorActions.updateEditorMarkers(markers);
  };

  handleClearJumpToEditorMarker = async () => {
    const { editorActions } = this.props;
    editorActions.clearJumpToEditorMarker();
  };

  render() {
    const { initialValue, language } = this.state;
    const { editorSelectors, specSelectors, width, height } = this.props;
    const defaultEditorTheme = 'my-vs-dark';
    const theme = editorSelectors.getEditorTheme() || defaultEditorTheme;
    const jumpToMarker = editorSelectors.getEditorJumpToMarker();
    const valueForEditor = specSelectors.specStr() || '';
    // expect methods via plugin(s) below
    let isReadOnly = 'false';
    if (editorSelectors?.getEditorIsReadyOnly) {
      isReadOnly = editorSelectors.getEditorIsReadyOnly() || 'false';
    }

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
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default MonacoEditorContainer;
