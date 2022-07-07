import { EDITOR_CONTENT_SET_ORIGIN } from './actions.js';

const reducers = {
  [EDITOR_CONTENT_SET_ORIGIN]: (state, action) => {
    return state.set('contentOrigin', action.payload);
  },
};

export default reducers;
