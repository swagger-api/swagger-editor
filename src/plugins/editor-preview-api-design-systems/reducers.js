import { toString } from '@swagger-api/apidom-core'; // eslint-disable-line
import {
  ADS_PARSE_IDLE,
  ADS_PARSE_STARTED,
  ADS_PARSE_SUCCESS,
  ADS_PARSE_FAILURE,
} from './actions.js';

const IDLE_STATUS = 'idle';
const PARSING_STATUS = 'parsing';
const SUCCESS_STATUS = 'success';
const FAILURE_STATUS = 'failure';

export const initialState = {
  apiDOM: null,
  parsingStatus: IDLE_STATUS,
};

/**
 * Case reducers modeled as finite state machine.
 */

const reducers = {
  [ADS_PARSE_IDLE]: (state) => {
    const allowedStatuses = [IDLE_STATUS, SUCCESS_STATUS, FAILURE_STATUS];
    const parsingStatus = state.get('parsingStatus') || IDLE_STATUS;

    if (allowedStatuses.includes(parsingStatus)) {
      return state.merge({
        parsingStatus: IDLE_STATUS,
        error: null,
        apiDOM: null,
      });
    }

    return state;
  },
  [ADS_PARSE_STARTED]: (state) => {
    const allowedStatuses = [IDLE_STATUS, SUCCESS_STATUS, FAILURE_STATUS];
    const parsingStatus = state.get('parsingStatus') || IDLE_STATUS;

    if (allowedStatuses.includes(parsingStatus)) {
      return state.set('parsingStatus', PARSING_STATUS);
    }

    return state;
  },
  [ADS_PARSE_SUCCESS]: (state, action) => {
    const parsingStatus = state.get('parsingStatus') || IDLE_STATUS;

    if (parsingStatus === PARSING_STATUS) {
      const { payload } = action;
      const { result: apiDOM } = payload;

      return state.merge({
        apiDOM: toString(apiDOM),
        parsingStatus: SUCCESS_STATUS,
      });
    }

    return state;
  },
  [ADS_PARSE_FAILURE]: (state, action) => {
    const parsingStatus = state.get('parsingStatus') || IDLE_STATUS;

    if (parsingStatus === PARSING_STATUS) {
      const { error } = action;

      return state.merge({
        error: error.message,
        parsingStatus: FAILURE_STATUS,
      });
    }

    return state;
  },
};

export default reducers;
