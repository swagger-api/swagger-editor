import { EDITOR_UPDATE_READ_ONLY } from './actions.js';

const reducers = {
  [EDITOR_UPDATE_READ_ONLY]: (state, action) => {
    return state.set('editorIsReadOnly', action.payload);
  },
};

export default reducers;
