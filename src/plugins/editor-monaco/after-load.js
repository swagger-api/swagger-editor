import { initialize as initializeMonacoServices, ILogService } from '@codingame/monaco-vscode-api';
import 'vscode/localExtensionHost';
import EditorWorkerConstructor from '@codingame/monaco-vscode-api/workers/editor.worker?worker';

import lazyMonacoContribution from './monaco-contribution/index.js';
import CustomLogger from './monaco-contribution/CustomLogger.js';

// The editor worker uses Vite's ?worker import so that Vite correctly handles
// individual node_modules source files with import rewriting in both dev and
// prod app builds. The apidom worker lives in src/ and is loaded via URL
// because Vite already rewrites its bare specifiers during normal module serving.

function afterLoad(system) {
  const InitPhase = {
    UNINITIALIZED: 'UNINITIALIZED',
    IN_PROGRESS: 'IN_PROGRESS',
    INITIALIZED: 'INITIALIZED',
  };

  // setup monaco environment
  globalThis.MonacoEnvironment = {
    initPhase: InitPhase.UNINITIALIZED,
    baseUrl: document.baseURI || location.href, // eslint-disable-line no-restricted-globals
    getWorker(workerId, label) {
      const isApidom = label === 'apidom';
      if (isApidom) {
        const workerPath = import.meta.env.DEV
          ? import.meta.env.VITE_APIDOM_WORKER_PATH
          : import.meta.env.VITE_APIDOM_WORKER_FILENAME;
        return new Worker(new URL(workerPath, this.baseUrl), { type: 'module' });
      }
      // For editor worker, use ?worker constructor so Vite handles dev-server
      // module transforms for the @codingame source files correctly.
      return new EditorWorkerConstructor();
    },
    ...globalThis.MonacoEnvironment, // this will allow to override the base uri for loading Web Workers
  };

  /**
   * Monaco standalone services can be initialized only once.
   * Standalone services cannot be disposed of when no longer needed.
   * Individual services can be disposed of separately, but if one decides
   * to do that, `initialize` function will not able to initialize them again.
   *
   * Extensions needs to initialized explicitly as well.
   */
  if (globalThis.MonacoEnvironment.initPhase === InitPhase.UNINITIALIZED) {
    globalThis.MonacoEnvironment.initPhase = InitPhase.IN_PROGRESS;

    (async () => {
      try {
        await initializeMonacoServices({
          [ILogService.toString()]: new CustomLogger(),
        });
        system.monacoInitializationDeferred().resolve();
      } catch (error) {
        system.monacoInitializationDeferred().reject(error);
      } finally {
        globalThis.MonacoEnvironment.initPhase = InitPhase.INITIALIZED;
      }
    })();

    lazyMonacoContribution({ system });
  }
}

export default afterLoad;
