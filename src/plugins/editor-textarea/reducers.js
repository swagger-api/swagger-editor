import { EDITOR_SET_CONTENT } from './actions.js';

export const initialState = {
  content: '',
  contentVersion: 1,
};

const reducers = {
  [EDITOR_SET_CONTENT]: (state, action) => {
    return state.set('content', action.payload);
  },
};

export default reducers;
