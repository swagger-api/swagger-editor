/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor-core';

import noop from '../../../utils/common-noop.js';
import getStyleMetadataLight, { themes as themesLight } from '../utils/monaco-theme-light.js';
import getStyleMetadataDark, { themes as themesDark } from '../utils/monaco-theme-dark.js';
import { dereference } from '../utils/monaco-action-apidom-deref.js';
import { languageID } from '../adapters/config.js';
import { setupLanguage } from '../adapters/setup.js';

class MonacoEditor extends Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
    this.currentValue = props.value;
  }

  componentDidMount() {
    setupLanguage();
    this.initMonacoEditor();
  }

  componentDidUpdate(prevProps) {
    const {
      value,
      language,
      theme,
      isReadOnly,
      jumpToMarker,
      height,
      width,
      options,
      clearJumpToMarker,
    } = this.props;
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
      this.changeTheme(editor, theme);
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
    if (prevProps.jumpToMarker !== jumpToMarker && jumpToMarker?.startLineNumber) {
      const startColumn = jumpToMarker?.startColumn || 1;
      editor.revealPositionNearTop({
        lineNumber: jumpToMarker.startLineNumber,
        column: startColumn,
      });
      editor.setPosition({
        lineNumber: jumpToMarker.startLineNumber,
        column: startColumn,
      });
      editor.focus();
      clearJumpToMarker();
    }
    if (prevProps.isReadOnly !== isReadOnly) {
      editor.updateOptions({ domReadOnly: isReadOnly, readOnly: isReadOnly });
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
    const { language, theme, options, defaultValue, isReadOnly } = this.props;
    let { value } = this.props;

    if (defaultValue && !value) {
      value = defaultValue;
    }
    if (this.containerElement) {
      this.editor = monaco.editor.create(
        this.containerElement,
        {
          value,
          language: languageID,
          // semantic tokens provider is disabled by default
          // https://github.com/microsoft/monaco-editor/issues/1833
          'semanticHighlighting.enabled': true,
          theme: theme || 'vs-dark',
          glyphMargin: true,
          lightbulb: {
            enabled: true,
          },
          // suggestOnTriggerCharacters: false,
          // inlineSuggest: false,
          lineNumbers: 'on',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          wordWrap: 'on',
          minimap: {
            enabled: true, //  can track via state, and toggle via `editor.updateOptions({ minimap: { enabled: true }})`
          },
          domReadOnly: isReadOnly,
          readOnly: isReadOnly,
          wordBasedSuggestions: false,
          // quickSuggestions: false,
          quickSuggestionsDelay: 300,
          fixedOverflowWidgets: true,
          'bracketPairColorization.enabled': true,
          suggest: {
            snippetsPreventQuickSuggestions: false,
          },
          renderWhitespace: true,
        },
        {
          storageService: {
            get() {},
            getBoolean(key) {
              if (key === 'expandSuggestionDocs') return true;
              return false;
            },
            // eslint-disable-next-line no-unused-vars
            getNumber(key) {
              return 0;
            },
            remove() {},
            store() {},
            onWillSaveState() {},
            onDidChangeStorage() {},
          },
        }
      );
      this.editor.getModel().updateOptions({ tabSize: 2 });
      // After creating monaco editor instance
      this.setupTheme(this.editor, theme);
      this.localEditorDidMount(this.editor);
    }
  };

  localEditorDidMount = (editor) => {
    const { editorDidMount, onChange } = this.props;
    editorDidMount(editor, monaco);
    this.subscription = editor.onDidChangeModelContent((event) => {
      const currentEditorValue = editor.getValue();
      // Always refer to the latest value
      this.currentValue = currentEditorValue;
      onChange(currentEditorValue, event);
    });

    // Add monaco actions, as needed
    // monaco ui tip: F1 -> resolve document
    editor.addAction({
      id: 'de-reference',
      label: 'resolve document',
      run: dereference,
    });
    // Add monaco commands, as needed
    // editor.addCommand({});

    // register listener for validation markers
    this.updateMarkersListener();
  };

  // eslint-disable-next-line class-methods-use-this
  updateMarkersListener = () => {
    const { editorMarkersDidChange } = this.props;
    monaco.editor.onDidChangeMarkers(() => {
      const markers = monaco.editor.getModelMarkers();
      // console.log('222: got marker changes, markers:', markers);
      editorMarkersDidChange(markers);
      // {
      //   code: "10097"
      //   endColumn: 5
      //   endLineNumber: 2
      //   message: "should always have a 'title'"
      //   owner: "apidom"
      //   relatedInformation: undefined
      //   resource: Uri { scheme: 'inmemory', authority: 'model', path: '/1', query: '', fragment: '', … }
      //   severity: 8
      //   source: "apilint"
      //   startColumn: 1
      //   startLineNumber: 2
      //   tags: undefined
      // }
    });
  };

  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  setupTheme = (editor, theme) => {
    // define custom themes
    monaco.editor.defineTheme('my-vs-dark', themesDark.seVsDark);
    monaco.editor.defineTheme('my-vs-light', themesLight.seVsLight);
    // apply (default) theme
    if (!theme) {
      monaco.editor.setTheme('my-vs-dark');
    } else {
      monaco.editor.setTheme(theme);
    }
  };

  // eslint-disable-next-line class-methods-use-this
  changeTheme = (editor, newThemeValue) => {
    if (newThemeValue === 'vs-dark') {
      monaco.editor.setTheme('vs-dark');
      // Apply token styles to built-in vs-dark theme default;
      // eslint-disable-next-line no-underscore-dangle
      editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark;
    }
    if (newThemeValue === 'vs-light' || newThemeValue === 'vs') {
      monaco.editor.setTheme('vs');
      // Apply token styles to built-in vs-light theme default;
      // eslint-disable-next-line no-underscore-dangle
      editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;
    }
    if (newThemeValue === 'my-vs-dark') {
      monaco.editor.setTheme('my-vs-dark');
    }
    if (newThemeValue === 'my-vs-light') {
      monaco.editor.setTheme('my-vs-light');
    }
  };

  render() {
    const { width, height } = this.props;
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
  isReadOnly: PropTypes.bool,
  options: PropTypes.oneOfType([PropTypes.object]), // ideally, should use PropTypes.shape once options gets implemented
  markers: PropTypes.oneOfType([PropTypes.array]),
  jumpToMarker: PropTypes.oneOfType([PropTypes.object]),
  editorDidMount: PropTypes.func,
  onChange: PropTypes.func,
  editorMarkersDidChange: PropTypes.func,
  clearJumpToMarker: PropTypes.func,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: null,
  isReadOnly: false,
  options: {},
  markers: [],
  jumpToMarker: {},
  editorDidMount: noop,
  onChange: noop,
  editorMarkersDidChange: noop,
  clearJumpToMarker: noop,
};

export default MonacoEditor;
