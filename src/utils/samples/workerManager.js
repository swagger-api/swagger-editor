/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { languageID } from './config';
// import ApidomWorker from '../../workers/apidom.worker';

export class WorkerManager {
  constructor() {
    this.worker = null;
    this.workerClientProxy = null;
  }

  // intent, private
  async getClientproxy() {
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
    console.log('returning proxy');
    console.log('this.workerClientProxy:', this.workerClientProxy);
    return this.workerClientProxy;
  }

  async getLanguageServiceWorker(uri) {
    console.log('resources:', uri);
    const _client = await this.getClientproxy(); // FAILS
    console.log('_client:', _client);
    await this.worker.withSyncedResources(uri);
    return _client;
  }
}
