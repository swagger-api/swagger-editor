import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';
import { debounce } from 'debounce';

import MonacoEditor from './MonacoEditor'; // load directly, do not use getComponent
// import ThemeSelection from './ThemeSelection';
import ThemeSelectionIcon from './ThemeSelectionIcon';

export default class EditorPane extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      language: 'apidom',
      theme: 'my-vs-dark',
      height: '90vh',
      width: '50',
      initialValue: 'Welcome to Swagger Editor',
    };
  }

  getSelectorSpecStr = () => {
    const { specSelectors } = this.props;
    const initialValue = 'Welcome to the TextArea';
    // get spec from swagger-ui state.spec
    const spec = specSelectors.specStr();
    return spec || initialValue;
  };

  handleChangeEditorValue = (val) => {
    const { specActions } = this.props;
    debounce(specActions.updateSpec(val), 20);
  };

  handleChangeThemeValue = async (val) => {
    const defaultThemeList = ['vs', 'vs-light', 'vs-dark', 'my-vs-light', 'my-vs-dark'];
    if (!defaultThemeList.includes(val)) {
      return;
    }
    this.setState({ theme: val });
  };

  // eslint-disable-next-line no-unused-vars
  handleEditorResize = (width, height) => {
    // console.log('handleEditorResize. args:', width, ' | ', height);
    this.setState({ width });
  };

  editorDidMount = (editor) => {
    editor.focus();
  };

  render() {
    const { initialValue, language, theme, height, width } = this.state;

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
};
