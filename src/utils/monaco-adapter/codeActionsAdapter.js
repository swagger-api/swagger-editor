import * as monaco from 'monaco-editor-core';
import {
  ProtocolToMonacoConverter,
  MonacoToProtocolConverter,
} from 'monaco-languageclient/lib/monaco-converter';

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
    const m2p = new MonacoToProtocolConverter(monaco);
    const diagnostics = m2p.asDiagnostics(ctx.markers);
    // call the validate method proxy from the language service and get code actions
    let actions;
    try {
      actions = await worker.doCodeActions(uri, diagnostics);
      if (!actions) {
        return Promise.resolve({
          actions: null,
          dispose: () => {},
          error: 'unable to doCodeActions',
        });
      }
    } catch (e) {
      return Promise.resolve({
        actions: null,
        dispose: () => {},
        error: 'unable to doCodeActions',
      });
    }
    // console.log('codeActionsAdapter... actions:', actions);
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
  }
}
