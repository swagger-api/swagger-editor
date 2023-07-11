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
    const range = vscodeDocument.getWordRangeAtPosition(position, /[a-zA-Z.]+/);
    const text = vscodeDocument.getText(range);
    const { items } = completionList;

    const isSubsequence = (label) => {
      const counter = label.split('').reduce((acc, el) => {
        if (text[acc]?.toLowerCase() === el?.toLowerCase()) {
          const increment = acc + 1;
          return increment;
        }
        return acc;
      }, 0);

      return counter === text.length;
    };

    return this.protocolConverter.asCompletionResult(
      items.filter(({ label }) => isSubsequence(label))
    );
  }
}

export default CompletionItemProvider;
