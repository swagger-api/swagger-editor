import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

import { fromPosition } from './monaco-helpers.js';

export default class CompletionItemsAdapter {
  constructor(worker) {
    this.worker = worker;
    this.completionContext = {
      maxNumberOfItems: 100,
    };
  }

  async provideCompletionItems(model, position) {
    const resource = model.uri;
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    const uri = resource.toString();
    const computedPosition = fromPosition(position);
    // call the validate method proxy from the language service and get completionItems info
    let info;
    try {
      info = await worker.doComplete(uri, computedPosition, this.completionContext);
      if (!info || info.items.length === 0) {
        return Promise.resolve(null);
      }
    } catch (e) {
      return Promise.resolve(null);
    }
    const wordInfo = model.getWordUntilPosition(position);
    const wordRange = new monaco.Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn
    );
    const p2m = new ProtocolToMonacoConverter(monaco);
    const result = p2m.asCompletionResult(info || null, wordRange);
    return Promise.resolve(result);
  }
}
