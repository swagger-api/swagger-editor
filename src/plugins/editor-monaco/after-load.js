import 'vscode/ext-hosts/commands';
import 'vscode/ext-hosts/configuration';
import 'vscode/ext-hosts/documentsAndEditors';
import 'vscode/ext-hosts/filesystem';
import 'vscode/ext-hosts/workspace';
import 'vscode/ext-hosts/languageFeatures';
import { StandaloneServices, IStorageService } from 'vscode/services';
import { initialize as initializeExtensions } from 'vscode/extensions';

const afterLoad = () => {
  /**
   * StandaloneServices is a singleton and can be initialized only once.
   * Subsequent initializations are noops. This has a side effect which
   * is inability to dispose of the services via StandaloneServices interface.
   * Individual services can be disposed of separately, but if one decides
   * to do that StandaloneServices will not able to initialize them again.
   *
   * Extensions needs to initialized explicitly.
   */
  StandaloneServices.initialize({});
  initializeExtensions();

  // enable showing documentation while autocomplete suggestions are listed
  StandaloneServices.get(IStorageService).store('expandSuggestionDocs', true, 0, 0);

  // setup monaco environment
  globalThis.MonacoEnvironment = {
    baseUrl: document.baseURI || location.href, // eslint-disable-line no-restricted-globals
    getWorkerUrl() {
      return new URL(process.env.REACT_APP_APIDOM_WORKER_FILENAME, this.baseUrl).toString();
    },
    ...(globalThis.MonacoEnvironment || {}), // this will allow to override the base uri for loading Web Workers
  };
};

export default afterLoad;
