/* eslint-disable class-methods-use-this */
export default class DocumentSymbolAdapter {
  constructor(worker) {
    this.worker = worker;
  }

  // eslint-disable-next-line no-unused-vars
  async getLegend(model) {
    // const resource = model.uri;
    // get the worker proxy (ts interface)
    // const worker = await this.worker(resource);
    const worker = await this.worker();
    try {
      const semanticTokensLegend = await worker.getSemanticTokensLegend();
      return Promise.resolve(semanticTokensLegend);
    } catch (e) {
      return Promise.resolve({ error: 'unable to getLegend' });
    }
  }

  async provideDocumentSemanticTokens(model) {
    const resource = model.uri;
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    const uri = resource.toString();
    try {
      const semanticTokens = await worker.findSemanticTokens(uri);
      return Promise.resolve(semanticTokens);
    } catch (e) {
      return Promise.resolve({ error: 'unable to provideDocumentSemanticTokens' });
    }
    // const document = createDocument(model);
    // return apidomService.computeSemanticTokens(document);
  }

  async releaseDocumentSemanticTokens() {
    // nothing to do
    return Promise.resolve(null);
  }
}
