import * as editorworker from 'node-modules/monaco-editor/esm/vs/editor/editor.worker';

import { ApidomWorker } from './apidomWorker';

/**
 * webpack entry: worker script to create a new object instance
 * both this file and editor.worker are expected to be served as Webpack chunks
 */
// eslint-disable-next-line no-restricted-globals
self.onmessage = () => {
  // ignore the first message
  editorworker.initialize((ctx, createData) => {
    return new ApidomWorker(ctx, createData);
  });
};
