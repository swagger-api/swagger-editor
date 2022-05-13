import * as monaco from 'monaco-editor-core';

import { languageExtensionPoint, monarchLanguage, languageId } from './workers/apidom/config.js';
import { setupApiDOM } from './workers/apidom/apidom-mode.js';

const makeAfterLoad =
  ({ createData = {} } = {}) =>
  () => {
    if (globalThis.MonacoEnvironment.loaded) return;

    globalThis.MonacoEnvironment = {
      baseUrl: document.baseURI || location.href, // eslint-disable-line no-restricted-globals
      getWorkerUrl(moduleId, label) {
        if (label === languageId) {
          return new URL('./apidom.worker.js', this.baseUrl).toString();
        }
        return new URL('./editor.worker.js', this.baseUrl).toString();
      },
      ...(globalThis.MonacoEnvironment || {}), // this will allow to override the base uri for loading Web Workers
    };

    monaco.languages.register(languageExtensionPoint);
    monaco.languages.onLanguage(languageId, () => {
      // enable syntax highlighting
      monaco.languages.setMonarchTokensProvider(languageId, monarchLanguage);
      // setup ApiDOM Language
      setupApiDOM(createData);
    });

    globalThis.MonacoEnvironment.loaded = true;
  };

export default makeAfterLoad;
