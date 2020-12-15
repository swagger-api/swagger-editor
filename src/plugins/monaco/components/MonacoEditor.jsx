import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor'; // eslint-disable-line import/no-unresolved

function noop() {} // export to utils later

export default class MonacoEditor extends Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
    this.currentValue = props.value;
  }

  componentDidMount() {
    this.initMonacoEditor();
  }

  componentDidUpdate(prevProps) {
    const { value, language, theme, height, width, options } = this.props;
    const { editor } = this;

    if (this.currentValue !== value) {
      this.currentValue = value;
      if (editor) {
        console.log('editor componentDidUpdate');
        // console.log('editor componentDidUpdate, will set to this.currentValue', this.currentValue);
        editor.setValue(this.currentValue);
      }
    }
    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(editor.getModel(), language);
    }
    if (prevProps.theme !== theme) {
      monaco.editor.setTheme(theme);
    }
    if (editor && (width !== prevProps.width || height !== prevProps.height)) {
      editor.layout();
    }
    if (prevProps.options !== options) {
      // Don't pass in the model on update because monaco crashes if we pass the model
      // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
      const { model: _model, ...optionsWithoutModel } = options;
      editor.updateOptions(optionsWithoutModel);
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  assignRef = (component) => {
    this.containerElement = component;
  };

  destroyMonaco() {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  initMonacoEditor() {
    // const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
    const { language, theme, options, defaultValue } = this.props;
    let { value } = this.props;

    if (defaultValue && !value) {
      value = defaultValue;
      // console.log('monacoEditor reset to defaultValue?', value);
    }
    if (this.containerElement) {
      // console.log('monaco editor create');
      // console.log('monaco editor create with value:', value);
      this.editor = monaco.editor.create(this.containerElement, {
        value,
        language,
        ...options,
        ...(theme ? { theme } : {}),
      });
      // After initializing monaco editor
      this.localEditorDidMount(this.editor);
    }
  }

  localEditorDidMount(editor) {
    const { editorDidMount, onChange } = this.props;
    // console.log('start localEditorDidMount');
    editorDidMount(editor, monaco);
    editor.onDidChangeModelContent((event) => {
      const currentEditorValue = editor.getValue();
      // Always refer to the latest value
      // console.log('localEditorDidMount checking for change. (editor) value:', currentEditorValue);
      // console.log('localEditorDidMount checking for change. (props) value:', value);
      this.currentValue = currentEditorValue;
      onChange(currentEditorValue, event);
    });
  }

  render() {
    const { width, height } = this.props;
    // const fixedWidth = processSize(width);
    // const fixedHeight = processSize(height);
    const style = {
      width,
      height,
    };

    return <div ref={this.assignRef} style={style} className="react-monaco-editor-container" />;
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.object]), // ideally, should use PropTypes.shape once options gets implemented
  editorDidMount: PropTypes.func,
  onChange: PropTypes.func,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: null,
  options: {},
  editorDidMount: noop,
  onChange: noop,
};
