import * as monaco from 'monaco-editor-core';
import { ProtocolToMonacoConverter } from 'monaco-languageclient/lib/monaco-converter.js';

import { fromPosition } from './monaco-helpers.js';

export default class CompletionItemsAdapter {
  #worker;

  #completionContext = {
    maxNumberOfItems: 100,
  };

  #p2m = new ProtocolToMonacoConverter(monaco);

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

  #maybeConvert(model, position, completionList) {
    if (completionList === null) {
      return null;
    }

    const wordPosition = model.getWordUntilPosition(position);
    const wordRange = new monaco.Range(
      position.lineNumber,
      wordPosition.startColumn,
      position.lineNumber,
      wordPosition.endColumn
    );

    return this.#p2m.asCompletionResult(completionList, wordRange);
  }

  async provideCompletionItems(model, position) {
    const completionList = await this.#getCompletionList(model, position);

    return this.#maybeConvert(model, position, completionList);
  }
}
