import { EDITOR_IMPORT_URL_SUCCESS } from '../top-bar/actions/import-url.js';

const reducers = {
  [EDITOR_IMPORT_URL_SUCCESS]: (state, action) => {
    return state.set('url', action.meta.url);
  },
};

export default reducers;
