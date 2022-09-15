import { createConverter as createCodeConverter } from 'vscode-languageclient/lib/common/codeConverter.js';
import { createConverter as createProtocolConverter } from 'vscode-languageclient/lib/common/protocolConverter.js';

export default class CompletionItemsAdapter {
  #worker;

  #completionContext = {
    maxNumberOfItems: 100,
  };

  #codeConverter = createCodeConverter();

  #protocolConverter = createProtocolConverter(undefined, true, true);

  constructor(worker) {
    this.#worker = worker;
  }

  async #getCompletionList(model, position) {
    const worker = await this.#worker(model.uri);

    try {
      return await worker.doComplete(
        model.uri.toString(),
        this.#codeConverter.asPosition(position),
        this.#completionContext
      );
    } catch {
      return undefined;
    }
  }

  async provideCompletionItems(model, position) {
    const completionList = await this.#getCompletionList(model, position);

    return this.#protocolConverter.asCompletionResult(completionList);
  }
}
