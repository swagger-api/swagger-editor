import type { Plugin } from 'vite';
import { resolve } from 'path';

interface WorkerPluginOptions {
  apidomWorkerPath?: string;
  editorWorkerPath?: string;
}

export const createWorkerPlugin = (options: WorkerPluginOptions = {}): Plugin => {
  const {
    apidomWorkerPath = './src/plugins/editor-monaco-language-apidom/language/apidom.worker.js',
    editorWorkerPath = './node_modules/monaco-editor/esm/vs/editor/editor.worker.start.js',
  } = options;

  return {
    name: 'vite-plugin-worker',
    enforce: 'pre',

    resolveId(id) {
      // Handle worker imports
      if (id === 'apidom.worker' || id.includes('apidom.worker')) {
        return resolve(process.cwd(), apidomWorkerPath);
      }
      if (id === 'editor.worker' || id.includes('editor.worker')) {
        return resolve(process.cwd(), editorWorkerPath);
      }
      return null;
    },

    transform(code, id) {
      // Replace worker filename placeholders in code
      if (code.includes('REACT_APP_APIDOM_WORKER_FILENAME') ||
          code.includes('REACT_APP_EDITOR_WORKER_FILENAME')) {

        let transformed = code;

        // Replace apidom worker filename
        transformed = transformed.replace(
          /process\.env\.REACT_APP_APIDOM_WORKER_FILENAME/g,
          JSON.stringify('./apidom.worker.js')
        );

        // Replace editor worker filename
        transformed = transformed.replace(
          /process\.env\.REACT_APP_EDITOR_WORKER_FILENAME/g,
          JSON.stringify('./editor.worker.js')
        );

        return {
          code: transformed,
          map: null,
        };
      }
      return null;
    },
  };
};
