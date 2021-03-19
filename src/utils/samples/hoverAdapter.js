import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter';

// eslint-disable-next-line no-unused-vars
import { fromPosition, toRange } from './utils-helpers';

export default class HoverAdapter {
  // experimental: accept a monaco instance
  constructor(worker, monaco) {
    this.worker = worker;
    this.monaco = monaco;
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
    // Working in-house version:
    // return Promise.resolve({
    //   range: toRange(info.range),
    //   contents: info.contents, // do we need to support markdown, via utils func?
    // });
    // experimental with an unstable build of monaco-converter, which can now accept a monaco instance
    const p2m = new ProtocolToMonacoConverter(this.monaco);
    const result = p2m.asHover(info);
    return Promise.resolve(result);
  }
}
