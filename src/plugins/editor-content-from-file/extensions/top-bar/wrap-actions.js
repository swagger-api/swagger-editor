import { createSafeActionWrapper } from '../../../util/fn.js';

export const importUrlSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    async ({ definition }) => {
      const { editorActions, fn, EditorContentOrigin } = system;

      const isValidJSON = fn.isValidJSONObject(definition) || fn.isValidJSONArray(definition);

      if (isValidJSON) {
        const fsa = await editorActions.convertContentToYAML(definition);

        if (!fsa.error) {
          editorActions.setContent(fsa.payload, EditorContentOrigin.ImportUrl);
        }
      }
    }
);

export const uploadFileSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    async ({ content }) => {
      const { editorActions, fn, EditorContentOrigin } = system;

      const isValidJSON = fn.isValidJSONObject(content) || fn.isValidJSONArray(content);

      if (isValidJSON) {
        const fsa = await editorActions.convertContentToYAML(content);

        if (!fsa.error) {
          editorActions.setContent(fsa.payload, EditorContentOrigin.ImportFile);
        }
      }
    }
);
