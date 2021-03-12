import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter';

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
    const items = await worker.doFindDocumentSymbols(uri);
    if (!items) {
      return Promise.resolve(null);
    }
    // Todo: confirm this works. Might be expecting "monaco not defined"
    // similar to how p2m.asHover doesn't work (hoverAdapter);
    // p2m.asSymbolKind appears to expect a monaco instance
    // https://github.com/TypeFox/monaco-languageclient/blob/f020bfd815bc7bb7fec000ed08cc59ccec8124a4/client/src/monaco-converter.ts#L728
    // monaco-playground has a shortcut "ctrl+shift+0" in the editor to display dropdown
    // which doesn't work (yet) in generic-editor
    const p2m = new ProtocolToMonacoConverter();
    const result = p2m.asDocumentSymbols(items);
    // console.log('provideDocumentSymbols result:', result);
    // const result = items.map((item) => ({
    //   name: item.name,
    //   detail: '',
    //   containerName: item.containerName,
    //   // kind: toSymbolKind(item.kind), // p2m.asSymbolKind
    //   range: toRange(item.location.range),
    //   selectionRange: toRange(item.location.range),
    //   tags: [],
    // }));
    return Promise.resolve(result);
  }
}
