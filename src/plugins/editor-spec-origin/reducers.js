import { SPEC_UPDATE_ORIGIN } from './actions.js';

const reduces = {
  [SPEC_UPDATE_ORIGIN]: (state, action) => {
    return state.set('specOrigin', action.payload);
  },
};

export default reduces;
