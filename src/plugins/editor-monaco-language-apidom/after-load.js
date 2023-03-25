import { ModesRegistry } from 'monaco-editor/esm/vs/editor/common/languages/modesRegistry.js';
import * as monaco from 'monaco-editor';

import { languageExtensionPoint, monarchLanguage, languageId } from './language/config.js';
import { setupApiDOM } from './language/apidom-mode.js';

const makeAfterLoad =
  ({ createData = {} } = {}) =>
  () => {
    /**
     * Parts of this code use ModesRegistry API instead of monaco.languages API.
     * The reason is that monaco.languages API is using ModesRegistory under the hood
     * but doesn't return disposables produced by ModesRegistry. By using ModesRegistry
     * directly we're able to obtain disposables.
     */

    // guard for multiple language registration
    const languages = ModesRegistry.getLanguages().map(({ id }) => id);
    if (languages.includes(languageId)) {
      return;
    }

    // setup monaco environment
    globalThis.MonacoEnvironment = {
      // expect monaco plugin to have already executed
      ...globalThis.MonacoEnvironment,
      getWorkerUrl(moduleId, label) {
        if (label === languageId) {
          return new URL('./apidom.worker.js', this.baseUrl).toString();
        }
        return new URL('./editor.worker.js', this.baseUrl).toString();
      },
    };

    // setting up ApiDOM language
    const disposables = [];
    disposables.push(ModesRegistry.registerLanguage(languageExtensionPoint));
    disposables.push(
      monaco.languages.onLanguage(languageId, () => {
        disposables.push(monaco.languages.setMonarchTokensProvider(languageId, monarchLanguage)); // enable syntax highlighting
        disposables.push(setupApiDOM({ languageId, options: createData }));

        // disposing of all allocated disposables
        disposables.push(
          monaco.editor.onWillDisposeModel((model) => {
            if (model.getLanguageId() === languageId) {
              disposables.forEach((disposable) => disposable.dispose());
            }
          })
        );
      })
    );
  };

export default makeAfterLoad;