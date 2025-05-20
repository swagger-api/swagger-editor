import * as monaco from 'monaco-editor';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export default class WorkerManager {
  #defaults = null;

  #worker = null;

  #client = null;

  #idleCheckInterval;

  #lastUsedTime = 0;

  constructor(defaults) {
    this.#defaults = defaults;
    this.#idleCheckInterval = setInterval(() => this.#checkIfIdle(), 30 * 1000);
  }

  #stopWorker() {
    if (this.#worker) {
      this.#worker.dispose();
      this.#worker = null;
    }
    this.#client = null;
  }

  #checkIfIdle() {
    if (!this.#worker) {
      return;
    }

    const timePassedSinceLastUsed = Date.now() - this.#lastUsedTime;
    if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
      this.#stopWorker();
    }
  }

  async getLanguageServiceWorker(...resources) {
    this.#lastUsedTime = Date.now();

    if (!this.#client) {
      this.#worker = monaco.editor.createWebWorker({
        moduleId: 'ApiDOMWorker',
        label: this.#defaults.getLanguageId(),
        createData: {
          ...this.#defaults.getWorkerOptions().data,
          languageId: this.#defaults.getLanguageId(),
          apiDOMContext: this.#defaults.getWorkerOptions().apiDOMContext,
          customWorkerPath: this.#defaults.getWorkerOptions().customWorkerPath,
        },
      });

      this.#client = await this.#worker.getProxy();
      await this.#worker.withSyncedResources(resources);
    }

    return this.#client;
  }

  dispose() {
    clearInterval(this.#idleCheckInterval);
    this.#stopWorker();
  }
}
