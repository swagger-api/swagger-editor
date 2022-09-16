import * as vscode from 'vscode';
import { StandaloneServices } from 'vscode/services'; // eslint-disable-line import/no-unresolved
import { createConverter as createCodeConverter } from 'vscode-languageclient/lib/common/codeConverter.js';
import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

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

const registerProviders = ({ languageId, providers, dependencies }) => {
  disposeAll(providers);

  const { worker, codeConverter, protocolConverter } = dependencies;
  const args = [worker, codeConverter, protocolConverter];

  providers.push(new DiagnosticsAdapter(...args));
  providers.push(vscode.languages.registerHoverProvider(languageId, new HoverAdapter(...args)));
  providers.push(
    vscode.languages.registerCompletionItemProvider(languageId, new CompletionItemsAdapter(...args))
  );
  providers.push(
    vscode.languages.registerCodeActionsProvider(languageId, new CodeActionsAdapter(...args))
  );
  providers.push(
    vscode.languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolsAdapter(...args))
  );
  providers.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      languageId,
      new SemanticTokensAdapter(...args),
      SemanticTokensAdapter.getLegend()
    )
  );
  providers.push(
    vscode.languages.registerDefinitionProvider(languageId, new DefinitionAdapter(...args))
  );

  return providers;
};

export function setupMode(defaults) {
  const disposables = [];
  const providers = [];
  const { languageId } = defaults;
  const codeConverter = createCodeConverter();
  const protocolConverter = createProtocolConverter(undefined, true, true);
  const client = new WorkerManager(defaults);

  StandaloneServices.initialize({});
  disposables.push(client);

  const worker = async (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };

  const registeredProviders = registerProviders({
    languageId,
    providers,
    dependencies: { worker, codeConverter, protocolConverter },
  });

  disposables.push(vscode.languages.setLanguageConfiguration(languageId, richLanguage));
  disposables.push(asDisposable(registeredProviders));
  disposables.push(asDisposable([StandaloneServices]));

  return asDisposable(disposables);
}

export function setupApiDOM(defaults) {
  return setupMode({ ...defaults, languageId: defaultLanguageId });
}
