import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

// eslint-disable-next-line no-unused-vars
import { fromPosition, toRange } from './monaco-helpers.js';

export default class HoverAdapter {
  constructor(worker) {
    this.worker = worker;
  }

  async provideHover(model, position) {
    const resource = model.uri;
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    const uri = resource.toString();
    const computedPosition = fromPosition(position);
    // call the validate method proxy from the language service and get hover info
    let info;
    try {
      info = await worker.doHover(uri, computedPosition);
      if (!info) {
        return Promise.resolve(null);
      }
    } catch (e) {
      return Promise.resolve(null);
    }
    const p2m = new ProtocolToMonacoConverter(monaco);
    const result = p2m.asHover(info);
    return Promise.resolve(result);
  }
}
