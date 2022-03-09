import reducers from './reducers.js';
import { selectSpecOrigin } from './selectors.js';
import { updateSpecOrigin } from './actions.js';
import { updateSpec } from './wrap-actions.js';

/**
 * Wraps updateSpec to include the "origin" parameter, defaulting to "not-editor".
 * Includes a selector to get the origin, specSelectors.specOrigin.
 */

const EditorSpecOriginPlugin = () => {
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec,
        },
        reducers,
        selectors: {
          selectSpecOrigin,
        },
        actions: {
          updateSpecOrigin,
        },
      },
    },
  };
};

export default EditorSpecOriginPlugin;
