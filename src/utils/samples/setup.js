/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { languageExtensionPoint, languageID } from './config';
import { monarchLanguage } from './monarchLang';
import EditorWorker from '../../workers/editor.worker';
import JsonWorker from '../../workers/json.worker';
import JsTsWorker from '../../workers/ts.worker';
// eslint-disable-next-line no-unused-vars
import ApidomWorker from '../../workers/apidom.worker';
import { WorkerManager } from './workerManager';

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
      // Placeholder, once implemented. detech openapi/asyncapi/etc.
      if (label === languageID) {
        console.log('should return apidomWorker');
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
    // next, instantiate a new WorkerManager() to proxy monaco.editor.createWebWorker()
    const client = new WorkerManager();
    console.log('client:', client);
    // const uri = monaco.Uri();
    // console.log('uri:', uri);
    const MODEL_URI = 'inmemory://model.json';
    // eslint-disable-next-line no-unused-vars
    const MONACO_URI = monaco.Uri.parse(MODEL_URI);
    // next, define a worker promise to actually getLanguageServiceWorker
    // eslint-disable-next-line no-unused-vars
    const worker = (...uris) => {
      console.log('got here');
      return client.getLanguageServiceWorker(...uris);
    };
    // worker(MONACO_URI);
    // next, call the errors provider, with the languageServiceWorker
    // new DiagnosticsAdapter(worker);
  });
}

export async function initializeWorkers() {
  // before loading monaco, we need to initialize the workers so that the files exist
  await new EditorWorker();
  await new JsonWorker();
  await new JsTsWorker();
  await new ApidomWorker();
}
