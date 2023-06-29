import Provider from './Provider.js';

class CompletionItemProvider extends Provider {
  #completionContext = {
    maxNumberOfItems: 100,
  };

  async #getCompletionList(vscodeDocument, position) {
    const worker = await this.worker(vscodeDocument.uri);

    try {
      return await worker.doComplete(
        vscodeDocument.uri.toString(),
        this.codeConverter.asPosition(position),
        this.#completionContext
      );
    } catch {
      return undefined;
    }
  }

  async provideCompletionItems(vscodeDocument, position) {
    const completionList = await this.#getCompletionList(vscodeDocument, position);

    return this.protocolConverter.asCompletionResult(completionList);
  }
}

export default CompletionItemProvider;
