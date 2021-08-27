import * as editorworker from 'monaco-editor-core/esm/vs/editor/editor.worker';

import { ApidomWorker } from './ApidomWorker';

/**
 * webpack entry: worker script to create a new object instance
 * both this file and editor.worker are expected to be served as Webpack chunks
 */
// eslint-disable-next-line no-restricted-globals
self.onmessage = () => {
  // ignore the first message
  // ref: .initialize(foreignModule)
  editorworker.initialize((ctx, createData) => {
    return new ApidomWorker(ctx, createData);
  });
};
