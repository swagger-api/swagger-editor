import { propChanged } from './actions';

export default {
  statePlugins: {
    editor: {
      actions: {
        propChanged,
      },
    },
  },
};
