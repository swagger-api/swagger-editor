import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter';

export default class HoverAdapter {
  constructor(worker) {
    this.worker = worker;
  }

  // eslint-disable-next-line no-unused-vars
  async provideCodeActions(model, range, ctx, token) {
    const resource = model.uri;
    // get the worker proxy (ts interface)
    const worker = await this.worker(resource);
    const uri = resource.toString();
    try {
      const actions = await worker.doCodeActions(uri);
      if (!actions) {
        return Promise.resolve({ error: 'unable to doCodeActions' });
      }
      const monacoActions = [];
      const p2m = new ProtocolToMonacoConverter(monaco);
      actions.forEach((action) => {
        monacoActions.push(p2m.asCodeAction(action));
      });
      const result = {
        actions: monacoActions,
        dispose: () => {},
      };
      return Promise.resolve(result);
    } catch (e) {
      return Promise.resolve({ error: 'unable to doCodeActions' });
    }
  }
}
