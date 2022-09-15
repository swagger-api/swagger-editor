import { createConverter as createCodeConverter } from 'vscode-languageclient/lib/common/codeConverter.js';
import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

export default class CodeActionsAdapter {
  #worker;

  #codeConverter = createCodeConverter();

  #protocolConverter = createProtocolConverter(undefined, true, true);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getCodeActionList(model, diagnosticList) {
    const worker = await this.#worker(model.uri);

    try {
      return worker.doCodeActions(model.uri.toString(), diagnosticList);
    } catch {
      return undefined;
    }
  }

  #maybeConvert(codeActionList) {
    if (typeof codeActionList === 'undefined') {
      return codeActionList;
    }

    return this.#protocolConverter.asCodeActionResult(codeActionList);
  }

  async provideCodeActions(model, range, ctx) {
    const diagnosticList = await this.#codeConverter.asDiagnostics(ctx.diagnostics);
    const codeActionList = await this.#getCodeActionList(model, diagnosticList);

    return this.#maybeConvert(codeActionList);
  }
}
