import { languages } from 'vscode';
import { createConverter as createCodeConverter } from 'vscode-languageclient/lib/common/codeConverter.js';
import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

import WorkerManager from './WorkerManager.js';
import DiagnosticsAdapter from './adapters/DiagnosticsAdapter.js';
import HoverAdapter from './adapters/HoverAdapter.js';
import DocumentLinkAdapter from './adapters/DocumentLinkAdapter.js';
import CompletionItemsAdapter from './adapters/CompletionItemsAdapter.js';
import DocumentSemanticTokensAdapter from './adapters/DocumentSemanticTokensAdapter.js';
import CodeActionsAdapter from './adapters/CodeActionsAdapter.js';
import DocumentSymbolsAdapter from './adapters/DocumentSymbolsAdapter.js';
import DefinitionAdapter from './adapters/DefinitionAdapter.js';

let apidomWorker;

const disposeAll = (disposables) => {
  while (disposables.length) {
    disposables.pop().dispose();
  }
};

const asDisposable = (disposables) => {
  return { dispose: () => disposeAll(disposables) };
};

export const getWorker = () => {
  if (!apidomWorker) {
    throw new Error('ApiDOM not registered');
  }
  return apidomWorker;
};

const registerProviders = ({ languageId, providers, dependencies }) => {
  disposeAll(providers);

  const { worker, codeConverter, protocolConverter, semanticTokensLegend } = dependencies;
  const args = [worker, codeConverter, protocolConverter];

  providers.push(new DiagnosticsAdapter(...args));
  providers.push(languages.registerHoverProvider(languageId, new HoverAdapter(...args)));
  providers.push(
    languages.registerDocumentLinkProvider(languageId, new DocumentLinkAdapter(...args))
  );
  providers.push(
    languages.registerCompletionItemProvider(languageId, new CompletionItemsAdapter(...args))
  );
  providers.push(
    languages.registerCodeActionsProvider(languageId, new CodeActionsAdapter(...args))
  );
  providers.push(
    languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolsAdapter(...args))
  );
  providers.push(
    languages.registerDocumentSemanticTokensProvider(
      languageId,
      new DocumentSemanticTokensAdapter(...args),
      semanticTokensLegend
    )
  );
  providers.push(languages.registerDefinitionProvider(languageId, new DefinitionAdapter(...args)));

  return providers;
};

export function setupMode(defaults) {
  const disposables = [];
  const providers = [];
  const codeConverter = createCodeConverter();
  const protocolConverter = createProtocolConverter(undefined, true, true);
  const client = defaults.getModeConfiguration().client || new WorkerManager(defaults);
  const worker = async (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };
  const registeredProviders = registerProviders({
    languageId: defaults.getLanguageId(),
    providers,
    dependencies: {
      worker,
      codeConverter,
      protocolConverter,
      semanticTokensLegend: defaults.getModeConfiguration().semanticTokensLegend,
    },
  });

  disposables.push(client);
  disposables.push(asDisposable(registeredProviders));

  apidomWorker = worker;
  disposables.push({
    dispose() {
      apidomWorker = null;
    },
  });

  return asDisposable(disposables);
}
