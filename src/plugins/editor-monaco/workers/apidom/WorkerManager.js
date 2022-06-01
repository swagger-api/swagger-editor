import * as monaco from 'monaco-editor-core';

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

  async #getClient() {
    this.#lastUsedTime = Date.now();

    if (!this.#client) {
      const {
        languageId,
        options: { customApiDOMWorkerPath, ...createData },
      } = this.#defaults;

      this.#worker = monaco.editor.createWebWorker({
        moduleId: 'ApiDOMWorker',
        label: languageId,
        createData: {
          ...createData,
          languageId,
          customWorkerPath: customApiDOMWorkerPath,
        },
      });
      this.#client = this.#worker.getProxy();
    }
    return this.#client;
  }

  async getLanguageServiceWorker(...resources) {
    const client = await this.#getClient();
    await this.#worker.withSyncedResources(resources);
    return client;
  }

  dispose() {
    clearInterval(this.#idleCheckInterval);
    this.#stopWorker();
  }
}
