/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { languageExtensionPoint, languageID } from './config';
import { monarchLanguage } from './monarchLang';
import EditorWorker from '../../workers/editor.worker';
import JsonWorker from '../../workers/json.worker';
import JsTsWorker from '../../workers/ts.worker';
// eslint-disable-next-line no-unused-vars
import ApidomWorker from '../../workers/apidom.worker';

export function setupLanguage() {
  // eslint-disable-next-line no-restricted-globals
  self.MonacoEnvironment = {
    getWorkerUrl: (moduleId, label) => {
      // console.log('try MonacoEnvironment with label:', label);
      if (label === 'json') {
        // console.log('should return jsonWorker, will remove later');
        return './json.worker.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        // console.log('should return jsTsWorker, will remove later');
        return './ts.worker.js';
      }
      // Placeholder, once implemented. detech openapi/asyncapi/etc.
      // if (label === 'json') {
      //   return './sampleLanguageWorker.worker.js';
      // }
      console.log('should return default editorWorker');
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
    // console.log('language.onLanguage callback for languageID:', languageID);
    // setMonarchTokensProvider enables syntax highlighting
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);
  });
}

export async function initializeWorkers() {
  // before loading monaco, we need to initialize the workers so that the files exist
  await new EditorWorker();
  await new JsonWorker();
  await new JsTsWorker();
  // await new ApidomWorker();
}
