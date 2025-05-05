import * as monaco from 'monaco-editor';
import { languages as vscodeLanguages } from 'vscode';
import { ModesRegistry } from '@codingame/monaco-vscode-api/vscode/vs/editor/common/languages/modesRegistry';

import * as apidom from './apidom.js';
import { setupMode } from './apidom-mode.js';
import createDereferenceActionDescriptor from './actions/dereference.js';

export { getWorker } from './apidom-mode.js';

const modeConfigurationDefault = {};

const workerOptionsDefault = {
  customWorkerPath: undefined,
  data: {},
};

class LanguageServiceDefaultsImpl {
  #languageId;

  #workerOptions;

  #modeConfiguration;

  constructor(workerOptions, modeConfiguration) {
    this.setLanguageId(apidom.languageId);
    this.setWorkerOptions(workerOptions);
    this.setModeConfiguration(modeConfiguration);
  }

  getLanguageId() {
    return this.#languageId;
  }

  setLanguageId(languageId) {
    this.#languageId = languageId;
  }

  getWorkerOptions() {
    return this.#workerOptions;
  }

  setWorkerOptions(workerOptions) {
    this.#workerOptions = workerOptions || JSON.parse(JSON.stringify(workerOptionsDefault));
  }

  getModeConfiguration() {
    return this.#modeConfiguration;
  }

  setModeConfiguration(modeConfiguration) {
    this.#modeConfiguration =
      modeConfiguration || JSON.parse(JSON.stringify(modeConfigurationDefault));
  }
}

export const apidomDefaults = new LanguageServiceDefaultsImpl(
  workerOptionsDefault,
  modeConfigurationDefault
);

export const isLanguageRegistered = () => {
  const languages = ModesRegistry.getLanguages().map(({ id }) => id);
  return languages.includes(apidom.languageId);
};

const lazyMonacoContribution = ({ createData, system }) => {
  const disposables = [];

  // register apidom language
  disposables.push(
    /**
     * This code uses ModesRegistry API instead of monaco.languages API.
     * The reason is that monaco.languages API is using ModesRegistry under the hood
     * but doesn't return disposables produced by ModesRegistry. By using ModesRegistry
     * directly we're able to obtain disposables.
     */
    ModesRegistry.registerLanguage({
      id: apidom.languageId,
    })
  );

  system.monacoInitializationDeferred().promise.then(() => {
    disposables.push(vscodeLanguages.setLanguageConfiguration(apidom.languageId, apidom.conf));
  });

  disposables.push(
    monaco.languages.setMonarchTokensProvider(apidom.languageId, apidom.monarchLanguageDef)
  );

  // setup apidom mode
  disposables.push(
    monaco.editor.onDidCreateEditor(() => {
      const { customApiDOMWorkerPath: customWorkerPath, apiDOMContext, ...data } = createData;
      const defaults = new LanguageServiceDefaultsImpl(
        { apiDOMContext, customWorkerPath, data },
        { getSystem: system.getSystem }
      );

      disposables.push(setupMode(defaults));
    })
  );

  // setup custom actions
  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        monaco.editor.onDidCreateModel(() => {
          const dereferenceActionDescriptor = createDereferenceActionDescriptor(system);
          if (!editor.getAction(dereferenceActionDescriptor.id)) {
            disposables.push(editor.addAction(dereferenceActionDescriptor));
          }
        })
      );
    })
  );

  // disposing of all allocated disposables
  disposables.push(
    monaco.editor.onDidCreateEditor((editor) => {
      disposables.push(
        editor.onDidDispose(() => {
          disposables.forEach((disposable) => disposable.dispose());
          disposables.length = 0;
        })
      );
    })
  );

  // setup monaco environment
  globalThis.MonacoEnvironment = {
    // expect editor-monaco plugin to have already executed
    ...globalThis.MonacoEnvironment,
    getWorkerUrl(moduleId, label) {
      if (label === apidom.languageId) {
        return new URL(process.env.REACT_APP_APIDOM_WORKER_FILENAME, this.baseUrl).toString();
      }
      return new URL(process.env.REACT_APP_EDITOR_WORKER_FILENAME, this.baseUrl).toString();
    },
  };
};

export default lazyMonacoContribution;
