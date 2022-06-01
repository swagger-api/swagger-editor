import * as monaco from 'monaco-editor-core';

import WorkerManager from './WorkerManager.js';
import DiagnosticsAdapter from './adapters/DiagnosticsAdapter.js';
import HoverAdapter from './adapters/HoverAdapter.js';
import CompletionItemsAdapter from './adapters/CompletionItemsAdapter.js';
import SemanticTokensAdapter from './adapters/SemanticTokensAdapter.js';
import CodeActionsAdapter from './adapters/CodeActionsAdapter.js';
import DocumentSymbolsAdapter from './adapters/DocumentSymbolsAdapter.js';
import DefinitionAdapter from './adapters/DefinitionAdapter.js';
import { richLanguage, languageId as defaultLanguageId } from './config.js';

const disposeAll = (disposables) => {
  while (disposables.length) {
    disposables.pop().dispose();
  }
};

const asDisposable = (disposables) => {
  return { dispose: () => disposeAll(disposables) };
};

const registerProviders = ({ languageId, providers, worker }) => {
  disposeAll(providers);

  providers.push(new DiagnosticsAdapter(worker));
  providers.push(monaco.languages.registerHoverProvider(languageId, new HoverAdapter(worker)));
  providers.push(
    monaco.languages.registerCompletionItemProvider(languageId, new CompletionItemsAdapter(worker))
  );
  providers.push(
    monaco.languages.registerCodeActionProvider(languageId, new CodeActionsAdapter(worker))
  );
  providers.push(
    monaco.languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolsAdapter(worker))
  );
  providers.push(
    monaco.languages.registerDocumentSemanticTokensProvider(
      languageId,
      new SemanticTokensAdapter(worker)
    )
  );
  providers.push(
    monaco.languages.registerDefinitionProvider(languageId, new DefinitionAdapter(worker))
  );

  return providers;
};

export function setupMode(defaults) {
  const disposables = [];
  const providers = [];
  const { languageId } = defaults;

  const client = new WorkerManager(defaults);
  disposables.push(client);

  const worker = async (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };

  const registeredProviders = registerProviders({ languageId, providers, worker });

  disposables.push(monaco.languages.setLanguageConfiguration(languageId, richLanguage));
  disposables.push(asDisposable(registeredProviders));

  return asDisposable(disposables);
}

export function setupApiDOM(defaults) {
  return setupMode({ ...defaults, languageId: defaultLanguageId });
}
