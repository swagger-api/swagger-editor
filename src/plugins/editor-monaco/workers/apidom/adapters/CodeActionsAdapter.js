import * as monaco from 'monaco-editor-core';
import {
  ProtocolToMonacoConverter,
  MonacoToProtocolConverter,
} from 'monaco-languageclient/lib/monaco-converter.js';

export default class CodeActionsAdapter {
  #worker;

  #p2m = new ProtocolToMonacoConverter(monaco);

  #m2p = new MonacoToProtocolConverter(monaco);

  constructor(worker) {
    this.#worker = worker;
  }

  #getDiagnosticList(ctx) {
    return this.#m2p.asDiagnostics(ctx.markers);
  }

  async #getCodeActionList(model, diagnosticList) {
    const worker = await this.#worker(model.uri);
    const error = {
      actions: null,
      dispose: () => {},
      error: 'unable to doCodeActions',
    };

    try {
      const codeActionList = await worker.doCodeActions(model.uri.toString(), diagnosticList);

      return codeActionList ?? error;
    } catch {
      return error;
    }
  }

  #maybeConvert(codeActionList) {
    if (typeof codeActionList?.error === 'string') {
      return codeActionList;
    }

    return {
      actions: codeActionList.map((codeAction) => this.#p2m.asCodeAction(codeAction)),
      dispose: () => {},
    };
  }

  async provideCodeActions(model, range, ctx) {
    const diagnosticList = this.#getDiagnosticList(ctx);
    const codeActionList = await this.#getCodeActionList(model, diagnosticList);

    return this.#maybeConvert(codeActionList);
  }
}
