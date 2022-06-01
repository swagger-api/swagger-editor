import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

import { fromPosition } from './monaco-helpers.js';

export default class DefinitionAdapter {
  #worker;

  #p2m = new ProtocolToMonacoConverter(monaco);

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

  #maybeConvert(location) {
    if (location === null) {
      return null;
    }

    return this.#p2m.asDefinitionResult(location);
  }

  async provideDefinition(model, position) {
    const location = this.#getLocation(model, position);

    return this.#maybeConvert(location);
  }
}
