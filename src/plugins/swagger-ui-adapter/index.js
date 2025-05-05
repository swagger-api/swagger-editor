import { updateSpec as updateSpecWrap } from './extensions/spec/wrap-actions.js';
import BaseLayoutWrapper from './extensions/core/wrap-components/BaseLayout.jsx';
import OnlineValidatorBadgeWrapper from './extensions/core/wrap-components/OnlineValidatorBadge.jsx';
import UtilPlugin from '../util/index.js';

/**
 * This plugin adapts plugins from this codebase to SwaggerUI.
 * Using this adapter, one can use SwaggerUI to preview multiple
 * specifications.
 */

const SwaggerUIAdapterPlugin = () => {
  const plugin = {
    wrapComponents: {
      BaseLayout: BaseLayoutWrapper,
      onlineValidatorBadge: OnlineValidatorBadgeWrapper,
    },
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec: updateSpecWrap,
        },
      },
    },
  };

  return [plugin, UtilPlugin];
};

export default SwaggerUIAdapterPlugin;
