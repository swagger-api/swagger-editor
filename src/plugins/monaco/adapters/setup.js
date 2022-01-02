import * as monaco from 'monaco-editor-core/esm/vs/editor/editor.api.js';

import { languageExtensionPoint, languageID } from './config.js';
import { monarchLanguage } from './monarch-language.js';
import { setupMode } from './setup-mode.js';
import ApiDOMWorker from '../workers/apidom/apidom.worker.js';
import EditorWorker from '../workers/editor.worker.js';

// eslint-disable-next-line import/prefer-default-export
export function setupLanguage() {
  // eslint-disable-next-line no-restricted-globals
  self.MonacoEnvironment = {
    getWorker: (moduleId, label) => {
      if (label === languageID) {
        return new ApiDOMWorker();
      }
      return new EditorWorker();
    },
  };

  monaco.languages.register(languageExtensionPoint);
  monaco.languages.onLanguage(languageID, () => {
    // setMonarchTokensProvider enables syntax highlighting
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);

    setupMode({ languageID });
  });
}
