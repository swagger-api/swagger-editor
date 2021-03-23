// eslint-disable-next-line no-unused-vars
import * as monaco from 'monaco-editor-core';
// eslint-disable-next-line no-unused-vars
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter';

// eslint-disable-next-line no-unused-vars
import { fromPosition, toRange } from './utils-helpers';

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
    const info = await worker.doHover(uri, computedPosition);
    // console.log('hoverAdapter. info:', info);
    if (!info) {
      // console.log('hoverAdapter, !info case');
      return Promise.resolve(null);
    }
    // partially working in-house version:
    // except that onDisplay, we don't see the tooltip
    // but the info object looks correct.
    // more to do here before return?
    // e.g diagnosticsAdapter invokes monaco.editor.setModelMarkers here
    // return Promise.resolve({
    //   range: toRange(info.range),
    //   contents: info.contents, // do we need to support markdown, via utils func?
    // });
    // experimental with an unstable build of monaco-converter, which can now accept a monaco instance
    // update: it is not required to include monaco in the class constructor
    // it also is not required to pass monaco to p2m, though it's better to be clear
    // however, it is required to import monaco above for p2m
    const p2m = new ProtocolToMonacoConverter(monaco);
    // eslint-disable-next-line no-unused-vars
    const result = p2m.asHover(info);
    return Promise.resolve(result);
    // return Promise.resolve({ message: 'hover success' }); This does not generate the tooltip
  }
}
