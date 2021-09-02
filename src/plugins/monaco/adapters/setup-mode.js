/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor-core';

import { WorkerManager } from './WorkerManager';
import DiagnosticsAdapter from './DiagnosticsAdapter';
import HoverAdapter from './HoverAdapter';
import CompletionItemsAdapter from './CompletionItemsAdapter';
import SemanticTokensAdapter from './SemanticTokensAdapter';
import CodeActionsAdapter from './CodeActionsAdapter';
import DocumentSymbolsAdapter from './DocumentSymbolsAdapter';
import DefinitionAdapter from './DefinitionAdapter';

const disposeAll = (disposables) => {
  while (disposables.length) {
    disposables.pop().dispose();
  }
};

const asDisposable = (disposables) => {
  return { dispose: () => disposeAll(disposables) };
};

const registerProviders = ({ languageID, providers, worker }) => {
  disposeAll(providers);

  const diagnostics = new DiagnosticsAdapter(worker);
  providers.push(diagnostics);
  const hover = new HoverAdapter(worker);
  providers.push(monaco.languages.registerHoverProvider(languageID, hover));
  const completionItems = new CompletionItemsAdapter(worker);
  providers.push(monaco.languages.registerCompletionItemProvider(languageID, completionItems));
  const codeActions = new CodeActionsAdapter(worker);
  providers.push(monaco.languages.registerCodeActionProvider(languageID, codeActions));
  const documentSymbols = new DocumentSymbolsAdapter(worker);
  providers.push(monaco.languages.registerDocumentSymbolProvider(languageID, documentSymbols));
  const semanticTokens = new SemanticTokensAdapter(worker);
  providers.push(
    monaco.languages.registerDocumentSemanticTokensProvider(languageID, semanticTokens)
  );
  const definitions = new DefinitionAdapter(worker);
  providers.push(monaco.languages.registerDefinitionProvider(languageID, definitions));
  return providers;
};

// { languageID, modeConfiguration } = defaults; may include onDidChange()? within defaults
export function setupMode({ languageID }) {
  const disposables = [];
  const providers = [];

  // instantiate a new WorkerManager() to proxy monaco.editor.createWebWorker()
  const client = new WorkerManager(); // with defaults?
  disposables.push(client);
  // define a worker promise to actually getLanguageServiceWorker
  const worker = (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };
  // register the providers with the worker we just creaeted
  const registeredProviders = registerProviders({ languageID, providers, worker });
  // we could do this too for additional configuration:
  // disposables.push(monaco.languages.setLanguageConfiguration(languageID, richLanguageConfiguration));

  disposables.push(asDisposable(registeredProviders));
  return asDisposable(disposables);
}
