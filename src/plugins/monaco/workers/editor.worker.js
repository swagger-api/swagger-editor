import { initialize } from 'monaco-editor-core/esm/vs/editor/editor.worker.js';

// eslint-disable-next-line no-restricted-globals
self.onmessage = () => {
  // ignore the first message
  // ref: .initialize(foreignModule)
  initialize(null);
};
