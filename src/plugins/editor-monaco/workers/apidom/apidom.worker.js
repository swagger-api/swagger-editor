import { initialize } from 'monaco-editor-core/esm/vs/editor/editor.worker.js';

import { makeCreate, ApiDOMWorker } from './ApiDOMWorker.js';

const create = makeCreate(ApiDOMWorker);

globalThis.onmessage = () => {
  initialize((ctx, createData) => {
    return create(ctx, createData);
  });
};

export { initialize, create, makeCreate, ApiDOMWorker };
