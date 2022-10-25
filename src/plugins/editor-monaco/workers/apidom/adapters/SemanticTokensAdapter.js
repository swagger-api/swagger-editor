import { getLanguageService, LogLevel } from '@swagger-api/apidom-ls';

import Adapter from './Adapter.js';

export default class SemanticTokensAdapter extends Adapter {
  static getLegend() {
    const languageService = getLanguageService({
      performanceLogs: true,
      logLevel: LogLevel.DEBUG,
      defaultLanguageContent: {
        namespace: 'asyncapi',
      },
    });

    try {
      return languageService.getSemanticTokensLegend();
    } catch {
      return undefined;
    } finally {
      languageService.terminate();
    }
  }

  async #getSemanticTokens(vscodeDocument) {
    const worker = await this.worker(vscodeDocument.uri);

    try {
      return await worker.findSemanticTokens(vscodeDocument.uri.toString());
    } catch {
      return undefined;
    }
  }

  async provideDocumentSemanticTokens(vscodeDocument) {
    const semanticTokens = await this.#getSemanticTokens(vscodeDocument);

    return this.protocolConverter.asSemanticTokens(semanticTokens);
  }
}
