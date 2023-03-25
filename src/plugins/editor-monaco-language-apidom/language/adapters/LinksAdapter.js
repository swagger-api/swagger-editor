import Adapter from './Adapter.js';

export default class LinksAdapter extends Adapter {
  async #getLinks(vscodeDocument) {
    const worker = await this.worker(vscodeDocument.uri);

    try {
      return await worker.doLinks(vscodeDocument.uri.toString());
    } catch {
      return undefined;
    }
  }

  async provideDocumentLinks(vscodeDocument) {
    const links = await this.#getLinks(vscodeDocument);

    return this.protocolConverter.asDocumentLinks(links);
  }

  // eslint-disable-next-line class-methods-use-this
  async resolveDocumentLink(link) {
    return link;
  }
}
