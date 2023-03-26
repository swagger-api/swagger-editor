import Adapter from './Adapter.js';

class DocumentSemanticTokensAdapter extends Adapter {
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

export default DocumentSemanticTokensAdapter;
