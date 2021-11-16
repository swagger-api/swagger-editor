/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { languageID } from './config';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager {
  // eslint-disable-next-line no-unused-vars
  constructor(defaults) {
    this.worker = null;
    this.workerClientProxy = null;
    // this.defaults = defaults; // from constructor
    // this.idleCheckInterval = setInterval(() => this.checkIfIdle(), 30 * 1000);
    // this.lastUsedTime = 0;
    // this.configChangeListener = this.defaults.onDidChange(() => this.stopWorker());
  }

  // intent, private
  getClientproxy() {
    if (!this.workerClientProxy) {
      this.worker = monaco.editor.createWebWorker({
        // module that exports the create() method and returns a `ApiDOMWorker` instance
        moduleId: 'ApiDOMWorker',
        label: languageID,
        // passed in to the create() method
        createData: {
          languageId: languageID,
        },
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
      // console.log('testing stopWorker after idle');
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
