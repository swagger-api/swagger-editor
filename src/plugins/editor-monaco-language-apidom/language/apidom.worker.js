// deep-extend references Buffer as a CJS global; set it on the worker's globalThis
// so the reference resolves when deepExtend() is first called (after module init).
import { Buffer as NodeBuffer } from 'buffer';
import { initialize } from 'monaco-editor/esm/vs/editor/editor.worker.js';

import { makeCreate, ApiDOMWorker } from './ApiDOMWorker.js';

if (typeof globalThis.Buffer === 'undefined') globalThis.Buffer = NodeBuffer;

const create = makeCreate(ApiDOMWorker);

initialize((ctx, createData) => create(ctx, createData));

export { initialize, create, makeCreate, ApiDOMWorker };
