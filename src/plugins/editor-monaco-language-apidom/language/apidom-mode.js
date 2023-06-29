import { languages as vscodeLanguages } from 'vscode';
import { initialize as initializeExtensions } from 'vscode/extensions';
import { createConverter as createCodeConverter } from 'vscode-languageclient/lib/common/codeConverter.js';
import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

import WorkerManager from './WorkerManager.js';
import DiagnosticsProvider from './providers/DiagnosticsProvider.js';
import HoverProvider from './providers/HoverProvider.js';
import DocumentLinkProvider from './providers/DocumentLinkProvider.js';
import CompletionItemProvider from './providers/CompletionItemProvider.js';
import DocumentSemanticTokensProvider from './providers/DocumentSemanticTokensProvider.js';
import CodeActionsProvider from './providers/CodeActionsProvider.js';
import DocumentSymbolProvider from './providers/DocumentSymbolProvider.js';
import DefinitionProvider from './providers/DefinitionProvider.js';

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

  (async () => {
    await initializeExtensions();

    providers.push(new DiagnosticsProvider(...args));
    providers.push(vscodeLanguages.registerHoverProvider(languageId, new HoverProvider(...args)));
    providers.push(
      vscodeLanguages.registerDocumentLinkProvider(languageId, new DocumentLinkProvider(...args))
    );
    providers.push(
      vscodeLanguages.registerCompletionItemProvider(
        languageId,
        new CompletionItemProvider(...args)
      )
    );
    providers.push(
      vscodeLanguages.registerCodeActionsProvider(languageId, new CodeActionsProvider(...args))
    );
    providers.push(
      vscodeLanguages.registerDocumentSymbolProvider(
        languageId,
        new DocumentSymbolProvider(...args)
      )
    );
    providers.push(
      vscodeLanguages.registerDefinitionProvider(languageId, new DefinitionProvider(...args))
    );

    const workerService = await worker();
    const semanticTokensLegend = await workerService.getSemanticTokensLegend();

    providers.push(
      vscodeLanguages.registerDocumentSemanticTokensProvider(
        languageId,
        new DocumentSemanticTokensProvider(...args),
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

  /**
   * Register ApiDOM providers.
   * We're already assuming here that extensions have
   * been successfully initialized.
   */
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
