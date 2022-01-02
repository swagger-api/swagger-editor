import * as monaco from 'monaco-editor-core/esm/vs/editor/editor.api.js';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

import { fromPosition } from './monaco-helpers.js';

export default class DefinitionAdapter {
  constructor(worker) {
    this.worker = worker;
  }

  // eslint-disable-next-line no-unused-vars
  async provideDefinition(model, position, token) {
    const resource = model.uri;
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    const uri = resource.toString();
    let def;
    try {
      def = await worker.provideDefinition(uri, fromPosition(position));
      if (!def) {
        return Promise.resolve(null);
      }
    } catch (e) {
      return Promise.resolve(null);
    }
    const p2m = new ProtocolToMonacoConverter(monaco);
    const result = p2m.asDefinitionResult(def);
    return Promise.resolve(result);
  }
}
