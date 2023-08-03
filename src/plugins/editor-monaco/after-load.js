import {
  initialize as initializeMonacoServices,
  StandaloneServices,
  IStorageService,
} from 'vscode/services';
import getLanguagesServiceOverride from 'vscode/service-override/languages';
import { initialize as initializeVscodeExtensions } from 'vscode/extensions';

function afterLoad() {
  /**
   * Monaco standalone services is a singleton and can be initialized only once.
   * Subsequent initializations are noops. This has a side effect which
   * is inability to dispose of the services when no longer needed.
   * Individual services can be disposed of separately, but if one decides
   * to do that, `initialize` function will not able to initialize them again.
   *
   * Extensions needs to initialized explicitly as well.
   */
  if (!this.vscodeInitStarted) {
    (async () => {
      this.vscodeInitStarted = true;
      await Promise.all([
        initializeMonacoServices({
          ...getLanguagesServiceOverride(),
        }),
        initializeVscodeExtensions(),
      ]);
      StandaloneServices.get(IStorageService).store('expandSuggestionDocs', true, 0, 0);
    })();
  }

  // setup monaco environment
  globalThis.MonacoEnvironment = {
    baseUrl: document.baseURI || location.href, // eslint-disable-line no-restricted-globals
    getWorkerUrl() {
      return new URL(process.env.REACT_APP_APIDOM_WORKER_FILENAME, this.baseUrl).toString();
    },
    ...(globalThis.MonacoEnvironment || {}), // this will allow to override the base uri for loading Web Workers
  };
}

export default afterLoad;
