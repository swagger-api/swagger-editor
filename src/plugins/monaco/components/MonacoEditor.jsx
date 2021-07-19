/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor-core';

import noop from '../../../utils/utils-noop';
// eslint-disable-next-line no-unused-vars
import getStyleMetadataLight from '../../../utils/utils-monaco-theme-light';
// eslint-disable-next-line no-unused-vars
import getStyleMetadataDark from '../../../utils/utils-monaco-theme-dark';
import { languageID } from '../../../utils/monaco-adapter/config';
import { setupLanguage, initializeWorkers } from '../../../utils/monaco-adapter/setup';

export default class MonacoEditor extends Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
    this.currentValue = props.value;
  }

  componentDidMount() {
    initializeWorkers();
    setupLanguage();
    this.initMonacoEditor();
  }

  componentDidUpdate(prevProps) {
    const { value, language, theme, height, width, options } = this.props;
    const { editor } = this;

    if (this.currentValue !== value) {
      this.currentValue = value;
      if (editor) {
        editor.setValue(this.currentValue);
      }
    }
    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(editor.getModel(), language);
    }
    if (prevProps.theme !== theme) {
      this.changeTheme(theme);
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

  destroyMonaco = () => {
    if (this.editor) {
      this.editor.dispose();
      const model = this.editor.getModel();
      if (model?.dispose) {
        model.dispose();
      }
    }
    if (this.subscription?.dispose) {
      this.subscription.dispose();
    }
  };

  initMonacoEditor = () => {
    // eslint-disable-next-line no-unused-vars
    const { language, theme, options, defaultValue } = this.props;
    let { value } = this.props;

    if (defaultValue && !value) {
      value = defaultValue;
      // console.log('monacoEditor reset to defaultValue?', value);
    }
    if (this.containerElement) {
      // console.log('monaco editor create');
      // console.log('monaco editor create with value:', value);
      // 1: register language, ref utils
      // 1A: register a language in component: monaco.languages.register({id: mylang})
      // 1B: or via web worker: monaco.languages.onLanguage('mylang', () => {})
      this.editor = monaco.editor.create(this.containerElement, {
        value,
        language: languageID,
        // semantic tokens provider is disabled by default
        // https://github.com/microsoft/monaco-editor/issues/1833
        'semanticHighlighting.enabled': true,
        theme: 'vs',
        glyphMargin: true,
        lightbulb: {
          enabled: true,
        },
        lineNumbers: 'on',
        autoIndent: 'full',
        wordWrap: 'on',
        minimap: {
          enabled: true, //  can track via state, and toggle via `editor.updateOptions({ minimap: { enabled: true }})`
        },
        // ...options,
        // ...(theme ? { theme } : {}), // think this is inactive, and may not be necessary; based on a sample
      });
      // Possible to init 2, 3, 4 below during the monaco.editor.create call?
      // if not, call a separate 'post-editor-load-init' method
      // or incorporate into this.props.editorDidMount
      // 2: setTheme, ref utils
      // 3: if necessary, editorLoadedCondition & operationContextCondition
      // 4: editor.addCommand
      // After initializing monaco editor
      this.setupTheme(this.editor);
      this.localEditorDidMount(this.editor);
    }
  };

  localEditorDidMount = (editor) => {
    const { editorDidMount, onChange } = this.props;
    // console.log('start localEditorDidMount');
    editorDidMount(editor, monaco);
    this.subscription = editor.onDidChangeModelContent((event) => {
      const currentEditorValue = editor.getValue();
      // console.log('start localEditorDidMount, currentEditorValue', currentEditorValue);
      // Always refer to the latest value
      this.currentValue = currentEditorValue;
      onChange(currentEditorValue, event);
    });
  };

  // eslint-disable-next-line no-unused-vars
  setupTheme = (editor) => {
    // monaco.editor.setTheme('vs-dark');
    // eslint-disable-next-line no-underscore-dangle
    // editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark;
    monaco.editor.setTheme('my-vs-dark');
    // eslint-disable-next-line no-underscore-dangle
    editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark;
    // monaco.editor.setTheme('vs-light');
    // eslint-disable-next-line no-underscore-dangle
    // editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;
    monaco.editor.setTheme('my-vs-light');
    // eslint-disable-next-line no-underscore-dangle
    editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;

    monaco.editor.defineTheme('my-vs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#C678DD', fontStyle: 'bold' }, // atom purple; e.g. externalDocs, tags, paths, swagger
        { token: 'identifier', foreground: '#D19A66', fontStyle: 'italic' }, // atom orange
        // add various identifier.nestedKey
        // response codes, comments, colons/slashes, are interpreted as 'invalid'
        { token: 'type', foreground: '#61AFEF', fontStyle: 'italic' }, // atom blue
        { token: 'pathItem', foreground: '66afce', fontStyle: 'italic' }, // light blue
        { token: 'operation', foreground: '66afce', fontStyle: 'underline' }, // light blue
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' }, // atom grey
      ],
      colors: {
        'editor.background': '#282c34',
        'editor.foreground': '#abb2bf',
        'editorLineNumber.foreground': '#636D83',
        'editorLineNumber.activeForeground': '#ABB2BF',
      },
    });

    monaco.editor.defineTheme('my-vs-light', {
      base: 'vs', // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [
        { token: 'keyword', foreground: '#C678DD', fontStyle: 'bold' }, // atom purple; e.g. externalDocs, tags, paths, swagger
        { token: 'identifier', foreground: '#D19A66', fontStyle: 'italic' }, // atom orange
        // add various identifier.nestedKey
        // response codes, comments, colons/slashes, are interpreted as 'invalid'
        { token: 'type', foreground: '#61AFEF', fontStyle: 'bold' }, // atom blue
        { token: 'pathItem', foreground: '66afce', fontStyle: 'bold italic' }, // light blue
        { token: 'operation', foreground: '66afce', fontStyle: 'bold underline' }, // light blue
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' }, // atom grey
        { token: 'String', foreground: '#50A14F' }, // atom
      ],
      colors: {
        'editor.background': '#FAFAFA',
        'editor.foreground': '#383a42',
        'editorLineNumber.foreground': '#9D9D9F',
        'editorLineNumber.activeForeground': '#383A42',
      },
    });
  };

  changeTheme = (newThemeValue) => {
    // console.log('editor component... changeTheme, newThemeValue:', newThemeValue);
    if (newThemeValue === 'vs-dark') {
      // console.log('editor component... changeTheme, vs-dark:');
      monaco.editor.setTheme('vs-dark');
    }
    if (newThemeValue === 'vs-light' || newThemeValue === 'vs') {
      // console.log('editor component... changeTheme, vs-light:');
      monaco.editor.setTheme('vs');
    }
    if (newThemeValue === 'my-vs-dark') {
      // console.log('editor component... changeTheme, my-vs-dark:');
      monaco.editor.setTheme('my-vs-dark');
    }
    if (newThemeValue === 'my-vs-light') {
      // console.log('editor component... changeTheme, my-vs-light:');
      monaco.editor.setTheme('my-vs-light');
    }
  };

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
