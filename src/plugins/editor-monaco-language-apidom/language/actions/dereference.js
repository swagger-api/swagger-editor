import { getWorker } from '../apidom-mode.js';

const dereferenceActionDescriptor = {
  id: 'apidom-dereference',
  label: 'Resolve document',
  async run(editor) {
    const model = editor.getModel();
    const worker = await getWorker()();
    const dereferenced = await worker.doDeref(model.uri.toString(), {
      baseURI: globalThis.document.baseURI || globalThis.location.href,
    });

    editor.setValue(dereferenced);
  },
};

export default dereferenceActionDescriptor;
