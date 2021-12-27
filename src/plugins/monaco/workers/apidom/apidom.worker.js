import * as editorworker from 'monaco-editor-core/esm/vs/editor/editor.worker';

import { ApiDOMWorker } from './ApiDOMWorker';

/**
 * Webpack entry: worker script to create a new object instance
 * this file is expected to be served as Webpack chunks
 */
// eslint-disable-next-line no-restricted-globals
self.onmessage = () => {
  // ignore the first message
  // ref: .initialize(foreignModule)
  editorworker.initialize((ctx, createData) => {
    return new ApiDOMWorker(ctx, createData);
  });
};
