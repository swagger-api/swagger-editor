import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

export default class DocumentSymbolAdapter {
  #worker;

  #protocolConverter = createProtocolConverter(undefined, true, true);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getSymbolInformationList(model) {
    const worker = await this.#worker(model.uri);

    try {
      return await worker.findDocumentSymbols(model.uri.toString());
    } catch {
      return undefined;
    }
  }

  async provideDocumentSymbols(model) {
    const symbolInformationList = await this.#getSymbolInformationList(model);

    return this.#protocolConverter.asDocumentSymbols(symbolInformationList);
  }
}
