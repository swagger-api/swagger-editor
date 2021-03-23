/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';
import * as apiDOM from 'apidom';
import ApiDOMParser from 'apidom-parser';
import * as openapi3_1AdapterJson from 'apidom-parser-adapter-openapi-json-3-1';
// import * as openapi3_1AdapterYaml from 'apidom-parser-adapter-openapi-yaml-3-1';
// import * as jsonAdapter from 'apidom-parser-adapter-json';
// import * as yamlAdapter from 'apidom-parser-adapter-yaml-1-2';
// import * as asyncapi2_0AdapterJson from 'apidom-parser-adapter-asyncapi-json-2-0';
// import * as asyncapi2_0AdapterYaml from 'apidom-parser-adapter-asyncapi-yaml-2-0';

import { languageExtensionPoint, languageID } from './config';
import { monarchLanguage } from './monarchLang';
import EditorWorker from '../../workers/editor.worker';
import JsonWorker from '../../workers/json.worker';
import JsTsWorker from '../../workers/ts.worker';
// eslint-disable-next-line no-unused-vars
import ApidomWorker from '../../workers/apidom.worker';
import { WorkerManager } from './workerManager';
import DiagnosticsAdapter from './diagnosticsAdapter';
import HoverAdapter from './hoverAdapter';
import CompletionItemsAdapter from './completionItemsAdapter';
// import SemanticTokensAdapter from './semanticTokensAdapter';
import CodeActionsAdapter from './codeActionsAdapter';
import DocumentSymbolsAdapter from './documentSymbolsAdapter';

export function setupLanguage() {
  // eslint-disable-next-line no-restricted-globals
  self.MonacoEnvironment = {
    getWorkerUrl: (moduleId, label) => {
      console.log('try MonacoEnvironment with label:', label);
      // if (label === 'json') {
      //   // console.log('should return jsonWorker, will remove later');
      //   return './json.worker.js';
      // }
      // if (label === 'typescript' || label === 'javascript') {
      //   // console.log('should return jsTsWorker, will remove later');
      //   return './ts.worker.js';
      // }
      if (label === languageID) {
        // console.log('should return apidomWorker');
        return './apidom.worker.js';
      }
      // console.log('should return default editorWorker');
      return './editor.worker.js';
    },
  };
  // const languageID = 'json'; // via config
  // const languageExtensionPoint = { id: languageID }; // via config
  // two example of .register, with same signature
  // monaco.languages.register({
  //   id: languageID,
  //   aliases: ['JSON', 'json'],
  // });
  // monaco.languages.register({
  //   id: 'javascript',
  // });
  monaco.languages.register(languageExtensionPoint);
  monaco.languages.onLanguage(languageID, () => {
    console.log('language.onLanguage callback for languageID:', languageID);
    // setMonarchTokensProvider enables syntax highlighting
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);
    // we could do this too for additional configuration:
    // monaco.languages.setLanguageConfiguration(languageID, richLanguageConfiguration);

    // Note: likely refactor this section into import of 'setupMode'
    // which will include the worker and providers
    // per the example in (css) monaco.contribution.ts
    // https://github.com/microsoft/monaco-css/blob/main/src/monaco.contribution.ts
    // next, instantiate a new WorkerManager() to proxy monaco.editor.createWebWorker()
    const client = new WorkerManager(); // with defaults?
    // console.log('client:', client);
    // const uri = new monaco.Uri();
    // console.log('uri:', uri);
    const MODEL_URI = 'inmemory://model.json';
    // eslint-disable-next-line no-unused-vars
    const MONACO_URI = monaco.Uri.parse(MODEL_URI);
    // console.log('MONACO_URI:', MONACO_URI);
    // next, define a worker promise to actually getLanguageServiceWorker
    // uris: Uri[]
    const worker = (...uris) => {
      return client.getLanguageServiceWorker(...uris);
    };
    worker(MONACO_URI);
    // next, call the errors provider, with the languageServiceWorker we just created
    // eslint-disable-next-line no-unused-vars
    const diagnostics = new DiagnosticsAdapter(worker);
    // register the provider(s)
    const hover = new HoverAdapter(worker);
    monaco.languages.registerHoverProvider(languageID, hover);
    const completionItems = new CompletionItemsAdapter(worker);
    monaco.languages.registerCompletionItemProvider(languageID, completionItems);
    // const semanticTokens = new SemanticTokensAdapter(worker);
    // monaco.languages.registerDocumentSemanticTokensProvider(languageID, semanticTokens);
    const codeActions = new CodeActionsAdapter(worker);
    monaco.languages.registerCodeActionProvider(languageID, codeActions);
    const documentSymbols = new DocumentSymbolsAdapter(worker);
    monaco.languages.registerDocumentSymbolProvider(languageID, documentSymbols);
  });
}

export async function initializeWorkers() {
  // before loading monaco, we need to initialize the workers so that the files exist
  await new EditorWorker();
  await new JsonWorker();
  await new JsTsWorker();
  await new ApidomWorker();
}

// This is a sample function to demonstrate that the parser loads
// and can parse a simple string
// However, as-is, it only supports the use of a single adapter,
// and cannot chain multiple ".use()" without additional work
// refer to 'apidom-playground' for a sample using multiple adapters
// https://github.com/swagger-api/apidom/blob/b375f5755d0233120544e2709e5d6614d2554712/experiments/apidom-playground/src/features/app/apidom.worker.js
// Expect to remove this function for production
export async function initializeParsers() {
  // eslint-disable-next-line prettier/prettier
  const parser = ApiDOMParser()
    // .use(jsonAdapter)
    // .use(yamlAdapter)
    .use(openapi3_1AdapterJson);
  // .use(openapi3_1AdapterYaml);
  // .use(asyncapi2_0AdapterJson)
  // .use(asyncapi2_0AdapterYaml);

  // console.log('what is parser:', parser); // { use, parse, findNamespace }
  const parseResult = await parser.parse('{"openapi": "3.1.0"}');
  if (!parseResult || !parseResult.api) {
    console.log(
      'initializeParsers. unable to parse argument. you probably tried to "use" multiple adapters'
    );
    return Promise.resolve({ error: 'unable to parse' });
  }
  const spec = apiDOM.toValue(parseResult.api);
  console.log('initializeParsers. spec:', spec);
  return Promise.resolve({ message: 'parse completed' });
}
