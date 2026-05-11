import { initialize } from 'monaco-editor/esm/vs/editor/editor.worker.js';

import { makeCreate, ApiDOMWorker } from './ApiDOMWorker.js';

const create = makeCreate(ApiDOMWorker);

initialize((ctx, createData) => create(ctx, createData));

export { initialize, create, makeCreate, ApiDOMWorker };
