/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { WorkerManager } from './WorkerManager.js';
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

  const diagnostics = new DiagnosticsAdapter(worker);
  providers.push(diagnostics);
  const hover = new HoverAdapter(worker);
  providers.push(monaco.languages.registerHoverProvider(languageId, hover));
  const completionItems = new CompletionItemsAdapter(worker);
  providers.push(monaco.languages.registerCompletionItemProvider(languageId, completionItems));
  const codeActions = new CodeActionsAdapter(worker);
  providers.push(monaco.languages.registerCodeActionProvider(languageId, codeActions));
  const documentSymbols = new DocumentSymbolsAdapter(worker);
  providers.push(monaco.languages.registerDocumentSymbolProvider(languageId, documentSymbols));
  const semanticTokens = new SemanticTokensAdapter(worker);
  providers.push(
    monaco.languages.registerDocumentSemanticTokensProvider(languageId, semanticTokens)
  );
  const definitions = new DefinitionAdapter(worker);
  providers.push(monaco.languages.registerDefinitionProvider(languageId, definitions));
  return providers;
};

export function setupMode(createData) {
  const disposables = [];
  const providers = [];
  const { languageId } = createData;

  // instantiate a new WorkerManager() to proxy monaco.editor.createWebWorker()
  const client = new WorkerManager(createData); // with defaults?
  disposables.push(client);
  // define a worker promise to actually getLanguageServiceWorker
  const worker = (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };
  // register the providers with the worker we just created
  const registeredProviders = registerProviders({ languageId, providers, worker });
  // we could do this too for additional configuration:

  disposables.push(monaco.languages.setLanguageConfiguration(languageId, richLanguage));

  disposables.push(asDisposable(registeredProviders));
  return asDisposable(disposables);
}

export function setupApiDOM(createData) {
  return setupMode({ ...createData, languageId: defaultLanguageId });
}
