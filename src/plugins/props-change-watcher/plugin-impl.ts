import { propChanged } from './actions.ts';

export default {
  statePlugins: {
    editor: {
      actions: {
        propChanged,
      },
    },
  },
};
