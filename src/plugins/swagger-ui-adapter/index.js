import { updateSpec as updateSpecWrap } from './wrap-actions.js';
import BaseLayoutWrapper from './wrap-components/BaseLayout.jsx';

/**
 * This plugin adapts plugins from this codebase to SwaggerUI.
 * Using this adapter, one can use SwaggerUI to preview multiple
 * specifications.
 */

const SwaggerUIAdapterPlugin = () => {
  return {
    wrapComponents: {
      BaseLayout: BaseLayoutWrapper,
    },
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec: updateSpecWrap,
        },
      },
    },
  };
};

export default SwaggerUIAdapterPlugin;
