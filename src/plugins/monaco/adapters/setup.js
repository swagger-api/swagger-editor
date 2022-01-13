import * as monaco from 'monaco-editor-core';

import { languageExtensionPoint, languageID } from './config.js';
import { monarchLanguage } from './monarch-language.js';
import { setupMode } from './setup-mode.js';

/* eslint-disable no-restricted-globals, import/prefer-default-export */

export function setupLanguage() {
  self.MonacoEnvironment = {
    baseUrl: document.baseURI || location.href,
    getWorkerUrl(moduleId, label) {
      if (label === languageID) {
        return new URL('./apidom.worker.js', this.baseUrl).toString();
      }
      return new URL('./editor.worker.js', this.baseUrl).toString();
    },
    ...(self.MonacoEnvironment || {}), // this will allow to override the base uri for loading Web Workers
  };

  monaco.languages.register(languageExtensionPoint);
  monaco.languages.onLanguage(languageID, () => {
    // enable syntax highlighting
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);

    setupMode({ languageID });
  });
}
