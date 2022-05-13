/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager {
  // eslint-disable-next-line no-unused-vars
  constructor(defaults) {
    this.worker = null;
    this.workerClientProxy = null;
    this._defaults = defaults;
    // TODO: placeholder code exists for possible memory performance improvements
    // this.idleCheckInterval = setInterval(() => this.checkIfIdle(), 30 * 1000);
    // this.lastUsedTime = 0;
    // this.configChangeListener = this.defaults.onDidChange(() => this.stopWorker());
  }

  // intent, private
  getClientproxy() {
    if (!this.workerClientProxy) {
      const { customApiDOMWorkerPath, ...createData } = this._defaults;
      createData.customWorkerPath = customApiDOMWorkerPath;

      this.worker = monaco.editor.createWebWorker({
        // module that exports the create() method and returns a `ApiDOMWorker` instance
        moduleId: 'ApiDOMWorker',
        label: this._defaults.languageId,
        // passed in to the create() method
        createData,
      });
      this.workerClientProxy = this.worker.getProxy(); // Promise pending
    }
    return this.workerClientProxy;
  }

  // resources: Uri[]
  async getLanguageServiceWorker(...resources) {
    const client = await this.getClientproxy();
    await this.worker.withSyncedResources(resources);
    return client;
  }

  // intended private
  stopWorker() {
    if (this.worker) {
      this.worker.dispose();
      this.worker = null;
    }
    this.client = null;
  }

  checkIfIdle() {
    if (!this.worker) {
      return;
    }
    const timePassedSinceLastUsed = Date.now() - this.lastUsedTime;
    if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
      this.stopWorker();
    }
  }

  // public
  dispose() {
    // clearInterval(this.idleCheckInterval);
    // this.configChangeListener.dispose();
    this.stopWorker();
  }
}
