import { languages as vscodeLanguages } from 'vscode';
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

  const { worker, codeConverter, protocolConverter } = dependencies;
  const args = [worker, codeConverter, protocolConverter];

  providers.push(new DiagnosticsAdapter(...args));
  providers.push(vscodeLanguages.registerHoverProvider(languageId, new HoverAdapter(...args)));
  providers.push(
    vscodeLanguages.registerDocumentLinkProvider(languageId, new DocumentLinkAdapter(...args))
  );
  providers.push(
    vscodeLanguages.registerCompletionItemProvider(languageId, new CompletionItemsAdapter(...args))
  );
  providers.push(
    vscodeLanguages.registerCodeActionsProvider(languageId, new CodeActionsAdapter(...args))
  );
  providers.push(
    vscodeLanguages.registerDocumentSymbolProvider(languageId, new DocumentSymbolsAdapter(...args))
  );
  providers.push(
    vscodeLanguages.registerDefinitionProvider(languageId, new DefinitionAdapter(...args))
  );

  (async () => {
    const workerService = await worker();
    const semanticTokensLegend = await workerService.getSemanticTokensLegend();

    providers.push(
      vscodeLanguages.registerDocumentSemanticTokensProvider(
        languageId,
        new DocumentSemanticTokensAdapter(...args),
        semanticTokensLegend
      )
    );
  })();

  return providers;
};

export function setupMode(defaults) {
  const disposables = [];
  const providers = [];
  const codeConverter = createCodeConverter();
  const protocolConverter = createProtocolConverter(undefined, true, true);

  // setup apidom worker
  const client = new WorkerManager(defaults);
  const worker = async (...uris) => client.getLanguageServiceWorker(...uris);
  apidomWorker = worker;
  disposables.push({
    dispose() {
      apidomWorker = null;
    },
  });
  disposables.push(client);

  // register apidom providers
  disposables.push(
    asDisposable(
      registerProviders({
        languageId: defaults.getLanguageId(),
        providers,
        dependencies: { worker, codeConverter, protocolConverter },
      })
    )
  );

  return asDisposable(disposables);
}
