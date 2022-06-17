import { ASYNCAPI_PARSER_ERROR_MARKERS } from './actions.js';

const reducers = {
  [ASYNCAPI_PARSER_ERROR_MARKERS]: (state, action) => {
    return state.set('asyncapiParserMarkers', action.payload);
  },
};

export default reducers;
