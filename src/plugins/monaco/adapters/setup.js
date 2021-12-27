import * as monaco from 'monaco-editor-core';

import { languageExtensionPoint, languageID } from './config';
import { monarchLanguage } from './monarch-language';
import { setupMode } from './setup-mode';

// eslint-disable-next-line import/prefer-default-export
export function setupLanguage() {
  // eslint-disable-next-line no-restricted-globals
  self.MonacoEnvironment = {
    getWorker: (moduleId, label) => {
      if (label === languageID) {
        return new Worker(new URL('../workers/apidom/apidom.worker', import.meta.url));
      }
      return new Worker(new URL('monaco-editor-core/esm/vs/editor/editor.worker', import.meta.url));
    },
  };

  monaco.languages.register(languageExtensionPoint);
  monaco.languages.onLanguage(languageID, () => {
    // setMonarchTokensProvider enables syntax highlighting
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);

    setupMode({ languageID });
  });
}
