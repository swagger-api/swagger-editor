/* eslint-disable global-require */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as monaco from 'monaco-editor';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';
import * as monaco from 'monaco-editor-core';
// import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// import * as JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// import * as JsTsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
// import * as EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker';
// import * as JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker';
// import * as JsTsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker';

// import * as EditorWorker from './editor.worker.chunk';
// import * as JsonWorker from './json.worker.chunk';
// import * as JsTsWorker from './ts.worker.chunk';
// import * as editorWorker from './editor.worker.chunk';
// import * as jsonWorker from './json.worker.chunk';
// import * as jsTsWorker from './ts.worker.chunk';
import EditorWorker from '../../../workers/editor.worker';
import JsonWorker from '../../../workers/json.worker';
import JsTsWorker from '../../../workers/ts.worker';
// eslint-disable-next-line no-unused-vars
import ApidomWorker from '../../../workers/apidom.worker';
import noop from '../../../utils/utils-noop';
// eslint-disable-next-line no-unused-vars
import { validate, provideDocumentSymbols, provideHover } from '../../../workers/apidomWorker';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

async function initializeWorkers() {
  // before loading monaco, we need to initialize the workers so that the files exist
  await new EditorWorker();
  await new JsonWorker();
  await new JsTsWorker();
  // await new ApidomWorker();
}

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorkerUrl: (moduleId, label) => {
    console.log('try MonacoEnvironment with label:', label);
    if (label === 'json') {
      console.log('should return jsonWorker');
      return './json.worker.js';
      // return './json.worker.chunk.js';
      // return './static/js/json.worker.chunk.js';
      // return new JsonWorker();
      // return JsonWorker;
    }
    if (label === 'typescript' || label === 'javascript') {
      console.log('should return jsTsWorker');
      return './ts.worker.js';
      // return './ts.worker.chunk.js';
      // return './static/js/ts.worker.chunk.js';
      // return new JsTsWorker();
      // return JsTsWorker;
    }
    console.log('should return default editorWorker');
    return './editor.worker.js';
    // return './editor.worker.chunk.js';
    // return '../static/js/editor.worker.chunk.js';
    // return new EditorWorker();
    // return EditorWorker;
  },
};

// global.MonacoEnvironment = {
//   getWorker(moduleId, label) {
//     let MonacoWorker;

//     switch (label) {
//       case 'json':
//         MonacoWorker = require('worker-loader!monaco-editor/esm/vs/language/json/json.worker');
//         // MonacoWorker = require('worker-loader!./json.worker');
//         break;
//       case 'javascript':
//         MonacoWorker = require('worker-loader!monaco-editor/esm/vs/langage/typescript/ts.worker');
//         // MonacoWorker = require('worker-loader!./ts.worker');
//         break;
//       default:
//         MonacoWorker = require('worker-loader!monaco-editor/esm/vs/editor/editor.worker');
//       // MonacoWorker = require('worker-loader!./editor.worker');
//     }

//     return new MonacoWorker();
//   },
// };

// global.MonacoEnvironment = {
//   getWorkerUrl(moduleId, label) {
//     switch (label) {
//       case 'json':
//         return './json.worker';
//       case 'javascript':
//         return './ts.worker';
//       default:
//         return './editor.worker.chunk';
//     }
//   },
// };

// once working, we should export this function
// eslint-disable-next-line no-unused-vars
function setupLanguage() {
  const languageID = 'json'; // can export to config
  // const languageExtensionPoint = { id: languageID }; // can export to config
  // const monarchLanguage; // can we import directly, to start?
  monaco.languages.register({
    id: languageID,
    aliases: ['JSON', 'json'],
  });
  monaco.languages.register({
    id: 'javascript',
  });
  monaco.languages.onLanguage(languageID, () => {
    console.log('language.onLanguage callback for languageID:', languageID);
    // monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);
  });
}

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

  destroyMonaco = () => {
    if (this.editor) {
      this.editor.dispose();
    }
  };

  initMonacoEditor = () => {
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
      // 1: register language, ref utils
      // 1A: register a language in component: monaco.languages.register({id: mylang})
      // 1B: or via web worker: monaco.languages.onLanguage('mylang', () => {})
      this.editor = monaco.editor.create(this.containerElement, {
        value,
        language,
        ...options,
        ...(theme ? { theme } : {}),
      });
      // Possible to init 2, 3, 4 below during the monaco.editor.create call?
      // if not, call a separate 'post-editor-load-init' method
      // or incorporate into this.props.editorDidMount
      // 2: setTheme, ref utils
      // 3: if necessary, editorLoadedCondition & operationContextCondition
      // 4: editor.addCommand
      // After initializing monaco editor
      this.registerProviders(this.editor);
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
  registerProviders = (editor) => {
    // const languageId = 'json';
    // const model = editor.getModel();
    // monaco.languages.registerDocumentSymbolProvider(languageId, {
    //   provideDocumentSymbols: provideDocumentSymbols({
    //     editor,
    //   }),
    // });
    // const position = new monaco.Position();
    // monaco.languages.registerHoverProvider(languageId, {
    //   provideHover: provideHover({
    //     editor,
    //     position,
    //   }),
    // });
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
