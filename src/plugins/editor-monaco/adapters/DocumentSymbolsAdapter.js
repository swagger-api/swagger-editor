import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

export default class DocumentSymbolAdapter {
  constructor(worker) {
    this.worker = worker;
  }

  async provideDocumentSymbols(model) {
    const resource = model.uri;
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    const uri = resource.toString();
    // call the validate method proxy from the language service and get document symbol items
    let items;
    try {
      items = await worker.findDocumentSymbols(uri);
      if (!items) {
        return Promise.resolve(null);
      }
    } catch (e) {
      return Promise.resolve(null);
    }
    const p2m = new ProtocolToMonacoConverter(monaco);
    const result = p2m.asDocumentSymbols(items);
    return Promise.resolve(result);
  }
}
