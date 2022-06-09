import * as monaco from 'monaco-editor-core';
import { getLanguageService, LogLevel } from '@swagger-api/apidom-ls';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/monaco-converter';

export default class SemanticTokensAdapter {
  #worker;

  #p2m = new ProtocolToMonacoConverter(monaco);

  #legendError = { error: 'unable to getLegend' };

  constructor(worker) {
    this.#worker = worker;
  }

  /**
   * Ideally, we want to use async, promises, and workers.
   * If/when monaco editor support it, rename this method to "getLegend".
   * Note: worker.getSemanticTokensLegend() does return the expected result
   */
  async getLegendAsync() {
    const worker = await this.#worker();

    try {
      return await worker.getSemanticTokensLegend();
    } catch {
      return this.#legendError;
    }
  }

  /**
   * monaco editor current expects a synchronous method,
   * so we import getLanguageService (above) directly in this adapter.
   */
  getLegend() {
    try {
      return getLanguageService({
        performanceLogs: false,
        logLevel: LogLevel.WARN,
      }).getSemanticTokensLegend();
    } catch {
      return this.#legendError;
    }
  }

  async #getSemanticTokens(model) {
    const worker = await this.#worker(model.uri);

    try {
      return await worker.findSemanticTokens(model.uri.toString());
    } catch {
      return { data: [], error: 'unable to provideDocumentSemanticTokens' };
    }
  }

  #maybeConvert(semanticTokens) {
    if (semanticTokens?.data?.length === 0 && typeof semanticTokens?.error === 'string') {
      return semanticTokens;
    }

    return this.#p2m.asSemanticTokens(semanticTokens);
  }

  async provideDocumentSemanticTokens(model) {
    const semanticTokens = await this.#getSemanticTokens(model);

    return this.#maybeConvert(semanticTokens);
  }

  // eslint-disable-next-line class-methods-use-this
  releaseDocumentSemanticTokens() {
    // nothing to do
  }
}
