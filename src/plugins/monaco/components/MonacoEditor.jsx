/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as monaco from 'monaco-editor';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor-core';

import noop from '../../../utils/utils-noop';
// eslint-disable-next-line no-unused-vars
import ApidomWorker from '../../../workers/apidom.worker';
// eslint-disable-next-line no-unused-vars
import getStyleMetadataLight from '../../../utils/utils-monaco-theme-light';
// eslint-disable-next-line no-unused-vars
import getStyleMetadataDark from '../../../utils/utils-monaco-theme-dark';
// eslint-disable-next-line no-unused-vars
// import { validate, provideDocumentSymbols, provideHover } from '../../../workers/apidomWorker';
import { languageID } from '../../../utils/monaco-adapter/config';
// eslint-disable-next-line no-unused-vars
import {
  setupLanguage,
  initializeWorkers,
  initializeParsers,
} from '../../../utils/monaco-adapter/setup';

export default class MonacoEditor extends Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
    this.currentValue = props.value;
  }

  componentDidMount() {
    initializeParsers();
    initializeWorkers();
    setupLanguage();
    this.initMonacoEditor();
  }

  componentDidUpdate(prevProps) {
    const { value, language, theme, height, width, options } = this.props;
    const { editor } = this;
    // console.log('editor component. props.theme:', theme);
    // console.log('editor component. prevProps.theme:', prevProps.theme);
    if (this.currentValue !== value) {
      this.currentValue = value;
      if (editor) {
        console.log('editor componentDidUpdate');
        // console.log('editor componentDidUpdate, will set to this.currentValue', this.currentValue);
        editor.setValue(this.currentValue);
        // the following retrieves the stored language option. does not interpret value
        // exists utils-converter.getDefinitionLanguage
        // language will only change appearance and not data,
        // eslint-disable-next-line no-underscore-dangle
        // const test = editor._configuration._rawOptions.language;
        // console.log('test, editor:', editor);
        // console.log('test:', test);
      }
    }
    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(editor.getModel(), language);
    }
    if (prevProps.theme !== theme) {
      // console.log('editor component. should change theme');
      // monaco.editor.setTheme(theme);
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
    }
  };

  initMonacoEditor = () => {
    // const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
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
    editor.onDidChangeModelContent((event) => {
      const currentEditorValue = editor.getValue();
      // Always refer to the latest value
      // console.log('localEditorDidMount checking for change. (editor) value:', currentEditorValue);
      // console.log('localEditorDidMount checking for change. (props) value:', value);
      // const testSetModelMarkers = editor.setModelMarkers; // undefined
      // console.log('testSetModelMarkers', testSetModelMarkers);
      // const testSetModelMarkers2 = monaco.editor.setModelMarkers; // this works
      // console.log('testSetModelMarkers2', testSetModelMarkers2);
      // const { validate } = apidomWorker;
      // eslint-disable-next-line no-unused-vars
      // const result = validate({ editor, setModelMarkers: testSetModelMarkers2 });
      // console.log('localEditor... validate result:', result);
      this.currentValue = currentEditorValue;
      onChange(currentEditorValue, event);
    });
  };

  // eslint-disable-next-line no-unused-vars
  setupTheme = (editor) => {
    // eslint-disable-next-line no-underscore-dangle
    // const testTheme = editor._themeService._theme.getTokenStyleMetadata;
    // console.log('testTheme:', testTheme);
    monaco.editor.setTheme('vs-dark');
    // eslint-disable-next-line no-underscore-dangle
    editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark;
    // eslint-disable-next-line no-underscore-dangle
    // const testThemeDark = editor._themeService._theme.getTokenStyleMetadata;
    // console.log('testThemeDark:', testThemeDark);
    monaco.editor.setTheme('vs-light');
    // eslint-disable-next-line no-underscore-dangle
    editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;
    // eslint-disable-next-line no-underscore-dangle
    // const testThemeLight = editor._themeService._theme.getTokenStyleMetadata;
    // console.log('testThemeLight:', testThemeLight);
  };

  // eslint-disable-next-line no-unused-vars
  changeTheme = (newThemeValue) => {
    // console.log('editor component... changeTheme, newThemeValue:', newThemeValue);
    if (newThemeValue === 'vs-dark') {
      console.log('editor component... changeTheme, vs-dark:');
      monaco.editor.setTheme('vs-dark');
    }
    if (newThemeValue === 'vs-light' || newThemeValue === 'vs') {
      console.log('editor component... changeTheme, vs-light:');
      monaco.editor.setTheme('vs');
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
