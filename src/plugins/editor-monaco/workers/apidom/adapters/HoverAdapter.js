import { createConverter as createCodeConverter } from 'vscode-languageclient/lib/common/codeConverter.js';
import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

export default class HoverAdapter {
  #worker;

  #codeConverter = createCodeConverter();

  #protocolConverter = createProtocolConverter(undefined, true, true);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getHover(model, position) {
    const worker = await this.#worker(model.uri);

    try {
      return await worker.doHover(model.uri.toString(), this.#codeConverter.asPosition(position));
    } catch {
      return undefined;
    }
  }

  async provideHover(model, position) {
    const hover = await this.#getHover(model, position);

    return this.#protocolConverter.asHover(hover);
  }
}
