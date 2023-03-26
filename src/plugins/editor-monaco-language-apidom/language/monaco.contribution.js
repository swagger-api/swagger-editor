import { languages as vscodeLanguages } from 'vscode';
import * as monaco from 'monaco-editor';
import { ModesRegistry } from 'monaco-editor/esm/vs/editor/common/languages/modesRegistry.js';

import * as apidom from './apidom.js';
import { setupMode } from './apidom-mode.js';
import WorkerManager from './WorkerManager.js';

export { getWorker } from './apidom-mode.js';

const modeConfigurationDefault = {
  semanticTokensLegend: {
    tokenModifiers: [],
    tokenTypes: [],
  },
  client: null,
};

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

const lazyMonacoContribution = ({ createData }) => {
  const disposables = [];

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
  disposables.push(vscodeLanguages.setLanguageConfiguration(apidom.languageId, apidom.conf));
  disposables.push(monaco.languages.setMonarchTokensProvider(apidom.languageId, apidom.language));

  disposables.push(
    monaco.languages.onLanguage(apidom.languageId, async () => {
      const { customApiDOMWorkerPath: customWorkerPath, ...data } = createData;
      const defaults = new LanguageServiceDefaultsImpl({ customWorkerPath, data });
      const client = new WorkerManager(defaults);
      const worker = await client.getLanguageServiceWorker();
      const semanticTokensLegend = await worker.getSemanticTokensLegend();

      defaults.getModeConfiguration().client = client;
      defaults.getModeConfiguration().semanticTokensLegend = semanticTokensLegend;

      disposables.push(setupMode(defaults));

      // disposing of all allocated disposables
      disposables.push(
        monaco.editor.onWillDisposeModel((model) => {
          if (model.getLanguageId() === apidom.languageId) {
            disposables.forEach((disposable) => disposable.dispose());
          }
        })
      );
    })
  );

  // setup monaco environment
  globalThis.MonacoEnvironment = {
    // expect monaco plugin to have already executed
    ...globalThis.MonacoEnvironment,
    getWorkerUrl(moduleId, label) {
      if (label === apidom.languageId) {
        return new URL('./apidom.worker.js', this.baseUrl).toString();
      }
      return new URL('./editor.worker.js', this.baseUrl).toString();
    },
  };
};

export default lazyMonacoContribution;
