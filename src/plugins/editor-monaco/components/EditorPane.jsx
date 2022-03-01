import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import YAML from 'js-yaml';
import ReactResizeDetector from 'react-resize-detector';
import { isJsonDoc } from '@swagger-api/apidom-ls';

// TODO: may want to update/replace { isJsonDoc }
// depending on if { isJsonDoc } also validates for both { isValidJson, isValidYaml }
// import { isValidJson, isValidYaml } from '../../../utils/spec-valid-json-yaml';

export default class EditorPane extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      language: 'apidom',
      height: '90vh',
      width: '50',
      initialValue: '',
    };
  }

  getSelectorSpecStr = () => {
    const { specSelectors } = this.props;
    const initialValue = '';
    // get spec from swagger-ui state.spec
    const spec = specSelectors.specStr();
    return spec || initialValue;
  };

  // eslint-disable-next-line no-unused-vars
  handleEditorResize = (width, height) => {
    this.setState({ width });
  };

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
    const { initialValue, language, height, width } = this.state;
    const { editorSelectors, getComponent } = this.props;

    const ValidationPane = getComponent('ValidationPane', true);
    const ThemeSelection = getComponent('ThemeSelection', true);
    const MonacoEditor = getComponent('MonacoEditor');

    const defaultEditorTheme = 'my-vs-dark';
    const theme = editorSelectors.getEditorTheme() || defaultEditorTheme;
    const jumpToMarker = editorSelectors.getEditorJumpToMarker();
    const valueForEditor = this.getSelectorSpecStr();

    return (
      <div id="editor-pane-wrapper" className="editor-pane-wrapper">
        <ValidationPane />
        <ThemeSelection />
        <ReactResizeDetector
          handleWidth
          handleHeight={false}
          onResize={this.handleEditorResize}
          refreshMode="debounce"
          refreshRate={100}
        />
        <MonacoEditor
          language={language}
          theme={theme}
          value={valueForEditor}
          defaultValue={initialValue}
          jumpToMarker={jumpToMarker}
          onChange={this.handleChangeEditorValue}
          height={height}
          width={width}
          editorDidMount={this.handleEditorDidMount}
          editorMarkersDidChange={this.handleEditorMarkersDidChange}
          clearJumpToMarker={this.handleClearJumpToEditorMarker}
        />
      </div>
    );
  }
}

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
