import reducers from './reducers.js';
import { selectContentOrigin } from './selectors.js';
import { setContentOrigin } from './actions.js';
import { setContent } from './wrap-actions.js';

/**
 * Wraps setContent to include the "contentOrigin" parameter, defaulting to "not-editor".
 * Includes a selector to get the origin: `editorSelectors.selectContentOrigin()`.
 */

const EditorContentOriginPlugin = () => {
  return {
    statePlugins: {
      editor: {
        wrapActions: {
          setContent,
        },
        reducers,
        selectors: {
          selectContentOrigin,
        },
        actions: {
          setContentOrigin,
        },
      },
    },
  };
};

export default EditorContentOriginPlugin;
