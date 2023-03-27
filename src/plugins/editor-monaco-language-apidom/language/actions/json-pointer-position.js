import { getWorker } from '../apidom-mode.js';

const jsonPointerPositionDescriptor = {
  id: 'swagger.editor.jsonPointerPosition',
  label: 'Translate JSON Pointer to editor position',
  async run(editor, { jsonPointer, onSuccess, onFailure }) {
    try {
      const model = editor.getModel();
      const worker = await getWorker()(model.uri);
      const position = await worker.getJsonPointerPosition(model.uri.toString(), jsonPointer);

      if (position) {
        onSuccess({ startLineNumber: position.line, startColumn: position.character - 1 });
      } else {
        onFailure(new Error(`Failed to compute position from JSON Pointer "${jsonPointer}"`));
      }
    } catch (error) {
      onFailure(error);
    }
  },
};

export default jsonPointerPositionDescriptor;
