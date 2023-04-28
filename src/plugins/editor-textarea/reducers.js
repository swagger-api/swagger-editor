import { EDITOR_SET_CONTENT, EDITOR_SETUP, EDITOR_TEAR_DOWN } from './actions.js';

export const initialState = {
  content: '',
  id: null,
};

const reducers = {
  [EDITOR_SET_CONTENT]: (state, action) => {
    return state.set('content', action.payload);
  },
  [EDITOR_SETUP]: (state, action) => {
    if (!action.meta.includes('textarea')) {
      return state;
    }
    return state.set('id', action.payload.id);
  },
  [EDITOR_TEAR_DOWN]: (state, action) => {
    if (!action.meta.includes('textarea')) {
      return state;
    }
    if (state.get('id') !== action.payload.id) {
      return state;
    }

    return state.delete('id');
  },
};

export default reducers;
