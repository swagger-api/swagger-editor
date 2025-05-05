import { propChanged } from './actions.js';

export default {
  statePlugins: {
    editor: {
      actions: {
        propChanged,
      },
    },
  },
};
