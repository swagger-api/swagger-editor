import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

import { fromPosition } from './monaco-helpers.js';

export default class DefinitionAdapter {
  #worker;

  #p2m = createProtocolConverter(undefined, true, true);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getLocation(model, position) {
    const worker = await this.#worker(model.uri);

    try {
      const location = await worker.provideDefinition(model.uri.toString(), fromPosition(position));
      return location ?? null;
    } catch {
      return null;
    }
  }

  async #maybeConvert(location) {
    if (location === null) {
      return null;
    }

    return this.#p2m.asDefinitionResult(location);
  }

  async provideDefinition(model, position) {
    const location = await this.#getLocation(model, position);

    return this.#maybeConvert(location);
  }
}
