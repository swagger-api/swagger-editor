import Provider from './Provider.js';

class CompletionItemProvider extends Provider {
  async #getCompletionList(vscodeDocument, position) {
    try {
      const worker = await this.worker(vscodeDocument.uri);

      return await worker.doComplete(
        vscodeDocument.uri.toString(),
        this.codeConverter.asPosition(position)
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
