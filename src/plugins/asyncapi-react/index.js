import LayoutDefault from './components/LayoutDefault.jsx';
import AsyncApiComponent from '../../components/AsyncApiComponent.jsx';
import { getIsOasOrAsyncApi2, shouldUpdateDefinitionLanguage } from './actions.js';

const AsyncApiPlugin = () => {
  return {
    components: {
      LayoutDefault,
      AsyncApiComponent,
    },
    statePlugins: {
      asyncapi: {
        actions: {
          getIsOasOrAsyncApi2,
          shouldUpdateDefinitionLanguage,
        },
      },
    },
    wrapComponents: {
      LayoutDefault,
    },
  };
};

// load into swagger-ui as a 'preset' collection of plugins
export default function asyncApiLayoutPreset() {
  return [AsyncApiPlugin];
}
