import { getWorker } from '../apidom-mode.js';

const dereferenceActionDescriptor = {
  id: 'swagger.editor.apidomDereference',
  label: 'Resolve document',
  async run(editor) {
    const model = editor.getModel();
    const worker = await getWorker()(model.uri);
    const dereferenced = await worker.doDeref(model.uri.toString(), {
      baseURI: globalThis.document.baseURI || globalThis.location.href,
    });

    editor.setValue(dereferenced);
  },
};

export default dereferenceActionDescriptor;
