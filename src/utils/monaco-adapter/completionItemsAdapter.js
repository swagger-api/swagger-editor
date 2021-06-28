import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter';

import { fromPosition } from './utils-helpers';

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
      if (!info) {
        return Promise.resolve(null);
      }
    } catch (e) {
      // console.log('completion info error:', e);
      return Promise.resolve(null);
    }
    const wordInfo = model.getWordUntilPosition(position);
    const wordRange = new Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn
    );
    const p2m = new ProtocolToMonacoConverter();
    const result = p2m.asCompletionResult(info, wordRange);
    return Promise.resolve(result);
  }
}
