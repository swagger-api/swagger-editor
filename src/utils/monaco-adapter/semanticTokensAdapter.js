/* eslint-disable class-methods-use-this */
import { getLanguageService } from 'apidom-ls';

export default class SemanticTokensAdapter {
  constructor(worker) {
    this.worker = worker;
  }

  // Ideally, we can use async, promises, and workers
  // If/when monaco editor support it, rename this method to "getLegend"
  // Note, worker.getSemanticTokensLegend() does return the expected result
  async getLegendAsync() {
    const worker = await this.worker();
    try {
      const semanticTokensLegend = await worker.getSemanticTokensLegend();
      return Promise.resolve(semanticTokensLegend);
    } catch (e) {
      return Promise.resolve({ error: 'unable to getLegend' });
    }
  }

  // monaco editor current expects a synchronous method
  // so we import getLanguageService (above) directly in this adapter
  getLegend() {
    try {
      return getLanguageService({}).getSemanticTokensLegend();
    } catch (e) {
      // console.error('semanticTokensAdapter.getLegend error:', e, e.stack);
      return { error: 'unable to getLegend' };
    }
  }

  async provideDocumentSemanticTokens(model) {
    const resource = model.uri;
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    const uri = resource.toString();
    try {
      const semanticTokens = await worker.findSemanticTokens(uri);
      // console.log('debug 1A: semanticTokens:', semanticTokens); // { data: Array(2525) }
      return Promise.resolve(semanticTokens);
    } catch (e) {
      // console.log('debug 1A: semanticTokens error:', e);
      return Promise.resolve({ data: [], error: 'unable to provideDocumentSemanticTokens' });
    }
  }

  async releaseDocumentSemanticTokens() {
    // nothing to do
    return Promise.resolve({});
  }
}
