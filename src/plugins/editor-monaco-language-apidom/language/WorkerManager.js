import * as monaco from 'monaco-editor';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export default class WorkerManager {
  #defaults = null;

  #worker = null;

  #client = null;

  #clientPromise = null;

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
    this.#clientPromise = null;
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

  async #initClient() {
    const languageId = this.#defaults.getLanguageId();
    const worker = await globalThis.MonacoEnvironment.getWorker('ApiDOMWorker', languageId);
    const createData = {
      ...this.#defaults.getWorkerOptions().data,
      languageId,
      apiDOMContext: this.#defaults.getWorkerOptions().apiDOMContext,
      customWorkerPath: this.#defaults.getWorkerOptions().customWorkerPath,
    };
    worker.postMessage(createData);

    this.#worker = monaco.editor.createWebWorker({
      worker,
      keepIdleModels: true,
    });

    this.#client = this.#worker.getProxy();
    return this.#client;
  }

  async #getClient() {
    this.#lastUsedTime = Date.now();
    this.#clientPromise ??= this.#initClient();
    return this.#clientPromise;
  }

  async getLanguageServiceWorker(...resources) {
    const client = await this.#getClient();

    if (this.#worker) {
      await this.#worker.withSyncedResources(resources);
    }

    return client;
  }

  dispose() {
    clearInterval(this.#idleCheckInterval);
    this.#stopWorker();
  }
}
