import Provider from './Provider.js';

class DocumentSemanticTokensProvider extends Provider {
  async #getSemanticTokens(vscodeDocument) {
    try {
      const worker = await this.worker(vscodeDocument.uri);

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

export default DocumentSemanticTokensProvider;
