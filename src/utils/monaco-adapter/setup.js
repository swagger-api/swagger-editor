import * as monaco from 'monaco-editor-core';

import { languageExtensionPoint, languageID } from './config';
import { monarchLanguage } from './monarchLang';
import EditorWorker from '../../workers/editor.worker';
import ApidomWorker from '../../workers/apidom.worker';
import { setupMode } from './setupMode';

export function setupLanguage() {
  // eslint-disable-next-line no-restricted-globals
  self.MonacoEnvironment = {
    getWorkerUrl: (moduleId, label) => {
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
    // console.log('language.onLanguage callback for languageID:', languageID);
    // setMonarchTokensProvider enables syntax highlighting
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);

    setupMode({ languageID });
  });
}

export async function initializeWorkers() {
  // before loading monaco, we need to initialize the workers so that the files exist
  await new EditorWorker();
  await new ApidomWorker();
}
