import { EDITOR_CONTENT_SET_READ_ONLY, EDITOR_CONTENT_SET_READ_WRITE } from './actions.js';

const reducers = {
  [EDITOR_CONTENT_SET_READ_ONLY]: (state) => {
    return state.set('contentIsReadOnly', true);
  },
  [EDITOR_CONTENT_SET_READ_WRITE]: (state) => {
    return state.set('contentIsReadOnly', false);
  },
};

export default reducers;
