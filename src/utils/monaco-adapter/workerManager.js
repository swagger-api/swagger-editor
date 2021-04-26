/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { languageID } from './config';
// import ApidomWorker from '../../workers/apidom.worker';

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
      // console.log('should createWebWorker');
      this.worker = monaco.editor.createWebWorker({
        // module that exports the create() method and returns a `ApidomWorker` instance
        moduleId: 'ApidomWorker',
        label: languageID,
        // passed in to the create() method
        createData: {
          languageId: languageID,
        },
      });
      // console.log('this.worker created:', this.worker); // ok, exists
      // assuming getProxy comes via createWebWorker output?
      // console.log('this.worker.getProxy:', this.worker.getProxy); // ok, exists
      // console.log('lookahead, this.worker.withSyncedResources:', this.worker.withSyncedResources); // ok, exists
      this.workerClientProxy = this.worker.getProxy(); // Promise pending
    }
    // console.log('returning proxy');
    // console.log('this.workerClientProxy:', this.workerClientProxy);
    return this.workerClientProxy;
  }

  // resources: Uri[]
  async getLanguageServiceWorker(...resources) {
    // console.log('resources:', resources);
    const _client = await this.getClientproxy();
    // console.log('_client done:', _client);
    await this.worker.withSyncedResources(resources);
    // console.log('withSyncedResources done');
    return _client;
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
      console.log('testing stopWorker after idle');
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
