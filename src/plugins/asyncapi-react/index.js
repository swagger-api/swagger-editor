import LayoutDefault from './components/LayoutDefault';
import AsyncApiComponent from '../../components/AsyncApiComponent';
import { getIsOasOrAsyncApi2, shouldUpdateDefinitionLanguage } from './actions';

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
