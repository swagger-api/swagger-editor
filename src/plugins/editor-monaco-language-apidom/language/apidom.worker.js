import { start } from 'monaco-editor/esm/vs/editor/editor.worker.start.js';

import { makeCreate, ApiDOMWorker } from './ApiDOMWorker.js';

const create = makeCreate(ApiDOMWorker);

globalThis.onmessage = (createData) => {
  start((ctx) => {
    return create(ctx, createData);
  });
};

export { create, makeCreate, ApiDOMWorker };
