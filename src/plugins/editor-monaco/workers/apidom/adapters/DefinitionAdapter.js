import Adapter from './Adapter.js';

export default class DefinitionAdapter extends Adapter {
  async #getLocation(vscodeDocument, position) {
    const worker = await this.worker(vscodeDocument.uri);

    try {
      return await worker.provideDefinition(
        vscodeDocument.uri.toString(),
        this.codeConverter.asPosition(position)
      );
    } catch {
      return undefined;
    }
  }

  async provideDefinition(vscodeDocument, position) {
    const location = await this.#getLocation(vscodeDocument, position);

    return this.protocolConverter.asDefinitionResult(location);
  }
}
