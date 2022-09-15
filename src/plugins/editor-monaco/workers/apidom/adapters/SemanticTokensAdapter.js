import { getLanguageService, LogLevel } from '@swagger-api/apidom-ls';

import Adapter from './Adapter.js';

export default class SemanticTokensAdapter extends Adapter {
  static getLegend() {
    try {
      return getLanguageService({
        performanceLogs: false,
        logLevel: LogLevel.WARN,
        defaultLanguageContent: {
          namespace: 'asyncapi',
        },
      }).getSemanticTokensLegend();
    } catch {
      return undefined;
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
