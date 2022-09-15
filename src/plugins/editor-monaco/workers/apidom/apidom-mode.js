import * as monaco from 'monaco-editor';
import * as vscode from 'vscode';
import { StandaloneServices } from 'vscode/services'; // eslint-disable-line import/no-unresolved

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
  providers.push(vscode.languages.registerHoverProvider(languageId, new HoverAdapter(worker)));
  providers.push(
    vscode.languages.registerCompletionItemProvider(languageId, new CompletionItemsAdapter(worker))
  );
  providers.push(
    vscode.languages.registerCodeActionsProvider(languageId, new CodeActionsAdapter(worker))
  );
  providers.push(
    vscode.languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolsAdapter(worker))
  );
  providers.push(
    monaco.languages.registerDocumentSemanticTokensProvider(
      languageId,
      new SemanticTokensAdapter(worker)
    )
  );
  providers.push(
    vscode.languages.registerDefinitionProvider(languageId, new DefinitionAdapter(worker))
  );

  return providers;
};

export function setupMode(defaults) {
  const disposables = [];
  const providers = [];
  const { languageId } = defaults;

  StandaloneServices.initialize({});

  const client = new WorkerManager(defaults);
  disposables.push(client);

  const worker = async (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };

  const registeredProviders = registerProviders({ languageId, providers, worker });

  disposables.push(vscode.languages.setLanguageConfiguration(languageId, richLanguage));
  disposables.push(asDisposable(registeredProviders));
  disposables.push(asDisposable([StandaloneServices]));

  return asDisposable(disposables);
}

export function setupApiDOM(defaults) {
  return setupMode({ ...defaults, languageId: defaultLanguageId });
}
