import { createSafeActionWrapper } from '../../../util/fn.js';

// eslint-disable-next-line import/prefer-default-export
export const dropFileSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    async ({ content }) => {
      const { editorActions, fn, EditorContentOrigin } = system;

      const isValidJSON = fn.isValidJSONObject(content) || fn.isValidJSONArray(content);

      if (isValidJSON) {
        const fsa = await editorActions.convertContentToYAML(content);

        if (!fsa.error) {
          editorActions.setContent(fsa.payload, EditorContentOrigin.FileDrop);
        }
      }
    }
);
