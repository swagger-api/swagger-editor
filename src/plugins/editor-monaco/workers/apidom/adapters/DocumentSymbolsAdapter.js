import Adapter from './Adapter.js';

export default class DocumentSymbolAdapter extends Adapter {
  async #getSymbolInformationList(vscodeDocument) {
    const worker = await this.worker(vscodeDocument.uri);

    try {
      return await worker.findDocumentSymbols(vscodeDocument.uri.toString());
    } catch {
      return undefined;
    }
  }

  async provideDocumentSymbols(vscodeDocument) {
    const symbolInformationList = await this.#getSymbolInformationList(vscodeDocument);

    return this.protocolConverter.asDocumentSymbols(symbolInformationList);
  }
}
