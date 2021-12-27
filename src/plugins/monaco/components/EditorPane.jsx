import YAML from 'js-yaml';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';
import { isJsonDoc } from '@swagger-api/apidom-ls';

import MonacoEditor from './MonacoEditor'; // load directly, do not use getComponent
// import ThemeSelection from './ThemeSelection';
import ThemeSelectionIcon from './ThemeSelectionIcon';
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

  handleChangeThemeValue = async (val) => {
    const defaultThemeList = ['vs', 'vs-light', 'vs-dark', 'my-vs-light', 'my-vs-dark'];
    if (!defaultThemeList.includes(val)) {
      return;
    }

    const { editorActions } = this.props;
    editorActions.updateEditorTheme(val);
  };

  // eslint-disable-next-line no-unused-vars
  handleEditorResize = (width, height) => {
    this.setState({ width });
  };

  // eslint-disable-next-line class-methods-use-this
  editorDidMount = (editor) => {
    editor.focus();
  };

  render() {
    const { initialValue, language, height, width } = this.state;
    const { editorSelectors } = this.props;

    const defaultEditorTheme = 'my-vs-dark';
    const theme = editorSelectors.getEditorTheme() || defaultEditorTheme;
    const valueForEditor = this.getSelectorSpecStr();

    return (
      <div id="editor-pane-wrapper" className="editor-pane-wrapper">
        {/* <ThemeSelection onChange={this.handleChangeThemeValue} /> */}
        <ThemeSelectionIcon theme={theme} onChange={this.handleChangeThemeValue} />
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
          height={height}
          width={width}
          onChange={this.handleChangeEditorValue}
          editorDidMount={this.editorDidMount}
        />
      </div>
    );
  }
}

EditorPane.propTypes = {
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
