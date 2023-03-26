import Adater from './Adapter.js';

class HoverAdapter extends Adater {
  async #getHover(vscodeDocument, position) {
    const worker = await this.worker(vscodeDocument.uri);

    try {
      return await worker.doHover(
        vscodeDocument.uri.toString(),
        this.codeConverter.asPosition(position)
      );
    } catch {
      return undefined;
    }
  }

  async provideHover(vscodeDocument, position) {
    const hover = await this.#getHover(vscodeDocument, position);

    return this.protocolConverter.asHover(hover);
  }
}

export default HoverAdapter;
