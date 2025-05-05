import YAML from 'js-yaml';

import { getWorker } from '../apidom-mode.js';

const createDereferenceActionDescriptor = ({ getSystem }) => ({
  id: 'swagger.editor.apidomDereference',
  label: 'Resolve document',
  async run(editor) {
    const system = getSystem();
    const isContentJSON = system.editorSelectors.selectIsContentFormatJSON();
    const isContentYAML = system.editorSelectors.selectIsContentFormatYAML();

    if (!isContentJSON && !isContentYAML) return; // nothing to do here

    const model = editor.getModel();
    const worker = await getWorker()(model.uri);
    const dereferenced = await worker.doDeref(model.uri.toString(), {
      baseURI: globalThis.document.baseURI || globalThis.location.href,
      format: isContentJSON ? 0 : isContentYAML ? 1 : 'unknown',
    });

    if (isContentYAML) {
      const nicelyFormattedYAML = YAML.dump(YAML.load(dereferenced));
      system.editorActions.setContent(nicelyFormattedYAML, system.EditorContentOrigin.Resolve);
    } else if (isContentJSON) {
      system.editorActions.setContent(dereferenced, system.EditorContentOrigin.Resolve);
    }
  },
});

export default createDereferenceActionDescriptor;
