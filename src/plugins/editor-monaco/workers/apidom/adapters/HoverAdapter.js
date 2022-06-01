import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

import { fromPosition } from './monaco-helpers.js';

export default class HoverAdapter {
  #worker;

  #p2m = new ProtocolToMonacoConverter(monaco);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getHover(model, position) {
    const worker = await this.#worker(model.uri);

    try {
      const computedPosition = fromPosition(position);
      const hover = await worker.doHover(model.uri.toString(), computedPosition);

      return hover ?? null;
    } catch {
      return null;
    }
  }

  #maybeConvert(hover) {
    return hover === null ? null : this.#p2m.asHover(hover);
  }

  async provideHover(model, position) {
    const hover = await this.#getHover(model, position);

    return this.#maybeConvert(hover);
  }
}
