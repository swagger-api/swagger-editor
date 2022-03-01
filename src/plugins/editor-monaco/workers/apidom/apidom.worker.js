import { initialize } from 'monaco-editor-core/esm/vs/editor/editor.worker.js';

import { ApiDOMWorker } from './ApiDOMWorker.js';

// eslint-disable-next-line no-restricted-globals
self.onmessage = () => {
  initialize((ctx, createData) => {
    return new ApiDOMWorker(ctx, createData);
  });
};
