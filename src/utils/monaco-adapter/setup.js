/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { languageExtensionPoint, languageID } from './config';
import { monarchLanguage } from './monarchLang';
import EditorWorker from '../../workers/editor.worker';
// import JsonWorker from '../../workers/json.worker';
// import JsTsWorker from '../../workers/ts.worker';
import ApidomWorker from '../../workers/apidom.worker';
import { setupMode } from './setupMode';

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

  monaco.languages.register(languageExtensionPoint);
  monaco.languages.onLanguage(languageID, () => {
    console.log('language.onLanguage callback for languageID:', languageID);
    // setMonarchTokensProvider enables syntax highlighting
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);

    setupMode({ languageID });
  });
}

export async function initializeWorkers() {
  // before loading monaco, we need to initialize the workers so that the files exist
  await new EditorWorker();
  // await new JsonWorker();
  // await new JsTsWorker();
  await new ApidomWorker();
}
