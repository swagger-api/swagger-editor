import { createConverter as createCodeConverter } from 'vscode-languageclient/lib/common/codeConverter.js';
import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

export default class CodeActionsAdapter {
  #worker;

  #p2m = createProtocolConverter(undefined, true, true);

  #m2p = createCodeConverter();

  constructor(worker) {
    this.#worker = worker;
  }

  async #getDiagnosticList(ctx) {
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
    const diagnosticList = await this.#getDiagnosticList(ctx);
    const codeActionList = await this.#getCodeActionList(model, diagnosticList);

    return this.#maybeConvert(codeActionList);
  }
}
