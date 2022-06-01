import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

export default class DocumentSymbolAdapter {
  #worker;

  #p2m = new ProtocolToMonacoConverter(monaco);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getSymbolInformationList(model) {
    const worker = await this.#worker(model.uri);

    try {
      const symbolInformationList = await worker.findDocumentSymbols(model.uri.toString());

      return symbolInformationList ?? null;
    } catch {
      return null;
    }
  }

  #maybeConvert(symbolInformationList) {
    if (symbolInformationList === null) {
      return null;
    }

    return this.#p2m.asDocumentSymbols(symbolInformationList);
  }

  async provideDocumentSymbols(model) {
    const symbolInformationList = await this.#getSymbolInformationList(model);

    return this.#maybeConvert(symbolInformationList);
  }
}
