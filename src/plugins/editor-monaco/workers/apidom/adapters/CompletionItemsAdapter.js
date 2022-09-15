import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

import { fromPosition } from './monaco-helpers.js';

export default class CompletionItemsAdapter {
  #worker;

  #completionContext = {
    maxNumberOfItems: 100,
  };

  #p2m = createProtocolConverter(undefined, true, true);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getCompletionList(model, position) {
    const worker = await this.#worker(model.uri);

    try {
      const computedPosition = fromPosition(position);
      const completionList = await worker.doComplete(
        model.uri.toString(),
        computedPosition,
        this.#completionContext
      );

      return !completionList || completionList.items.length === 0 ? null : completionList;
    } catch {
      return null;
    }
  }

  async #maybeConvert(completionList) {
    if (completionList === null) {
      return null;
    }

    return this.#p2m.asCompletionResult(completionList);
  }

  async provideCompletionItems(model, position) {
    const completionList = await this.#getCompletionList(model, position);

    return this.#maybeConvert(completionList);
  }
}
