/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor-core';
import { getLanguageService, isJsonDoc, FORMAT } from 'apidom-ls';
import YAML from 'js-yaml';
import { TextDocument } from 'vscode-languageserver-textdocument';

import metadata from '../../../workers/metadataJs';
import noop from '../../../utils/utils-noop';
// eslint-disable-next-line no-unused-vars
import getStyleMetadataLight, {
  themes as themesLight,
} from '../../../utils/utils-monaco-theme-light';
// eslint-disable-next-line no-unused-vars
import getStyleMetadataDark, { themes as themesDark } from '../../../utils/utils-monaco-theme-dark';
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
        theme: theme || 'vs-dark',
        glyphMargin: true,
        lightbulb: {
          enabled: true,
        },
        lineNumbers: 'on',
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        wordWrap: 'on',
        minimap: {
          enabled: true, //  can track via state, and toggle via `editor.updateOptions({ minimap: { enabled: true }})`
        },
        wordBasedSuggestions: false,
        // quickSuggestions: false,
        fixedOverflowWidgets: true,
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
      this.setupTheme(this.editor, theme);
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

    const apidomContext = {
      metadata: metadata(),
    };
    const languageService = getLanguageService(apidomContext);

    // TODO (francesco.tumanischvili@smartbear.com) move this elsewhere (worker?)
    editor.addAction({
      id: 'de-reference',
      label: 'resolve document',
      // eslint-disable-next-line no-unused-vars
      run: (ed) => {
        const textDoc = TextDocument.create(
          editor.getModel().uri.toString(),
          editor.getModel().getModeId(),
          editor.getModel().getVersionId(),
          editor.getModel().getValue()
        );
        const context = {
          format: isJsonDoc(textDoc) ? FORMAT.JSON : FORMAT.YAML,
          baseURI: window.location.href,
        };
        languageService.doDeref(textDoc, context).then((result) => {
          if (!isJsonDoc(textDoc)) {
            const tempjsContent = YAML.safeLoad(result);
            const tempyamlContent = YAML.safeDump(tempjsContent);
            editor.setValue(tempyamlContent);
          } else {
            editor.setValue(result);
          }
        });
      },
    });
  };

  // eslint-disable-next-line no-unused-vars
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
