import { initialize } from 'monaco-editor-core/esm/vs/editor/editor.worker.js';

// eslint-disable-next-line no-restricted-globals
self.onmessage = () => {
  initialize(null);
};
