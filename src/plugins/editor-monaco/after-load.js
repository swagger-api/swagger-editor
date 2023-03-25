import { StandaloneServices, IStorageService } from 'vscode/services'; // eslint-disable-line import/no-unresolved

const afterLoad = () => {
  /**
   * StandaloneServices is a singleton and can be initialized only once.
   * Subsequent initializations are noops. This has a side effect which
   * is inability to dispose of the services via StandaloneServices interface.
   * Individual services can be disposed of separately, but if one decides
   * to do that StandaloneServices will not able to initialize them again.
   */
  StandaloneServices.initialize({});

  // enable showing documentation while autocomplete suggestions are listed
  StandaloneServices.get(IStorageService).store('expandSuggestionDocs', true, 0, 0);

  // setup monaco environment
  globalThis.MonacoEnvironment = {
    baseUrl: document.baseURI || location.href, // eslint-disable-line no-restricted-globals
    getWorkerUrl() {
      return new URL('./editor.worker.js', this.baseUrl).toString();
    },
    ...(globalThis.MonacoEnvironment || {}), // this will allow to override the base uri for loading Web Workers
  };
};

export default afterLoad;
