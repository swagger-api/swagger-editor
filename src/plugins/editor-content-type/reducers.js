import {
  EDITOR_CONTENT_TYPE_DETECT_STARTED,
  EDITOR_CONTENT_TYPE_DETECT_SUCCESS,
  EDITOR_CONTENT_TYPE_DETECT_FAILURE,
} from './actions.js';

export const IDLE_STATUS = 'idle';
export const DETECTING_STATUS = 'detecting';
export const SUCCESS_STATUS = 'success';
export const FAILURE_STATUS = 'failure';

export const initialState = {
  contentTypeDetectionStatus: IDLE_STATUS,
  contentTypeDetectionRequestId: null,
  contentType: null,
  contentTypeError: null,
};

/**
 * Case reducers modeled as finite state machine.
 */

const detectContentStartedReducer = (state, action) => {
  return state.merge({
    contentTypeDetectionStatus: DETECTING_STATUS,
    contentTypeDetectionRequestId: action.meta.requestId,
  });
};

const detectContentSuccessReducer = (state, action) => {
  const status = state.get('contentTypeDetectionStatus') || IDLE_STATUS;
  const requestId = state.get('contentTypeDetectionRequestId');

  if (status === DETECTING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      contentTypeDetectionStatus: SUCCESS_STATUS,
      contentTypeDetectionRequestId: null,
      contentType: action.payload,
      contentTypeError: null,
    });
  }

  return state;
};

const detectContentFailureReducer = (state, action) => {
  const status = state.get('contentTypeDetectionStatus') || IDLE_STATUS;
  const requestId = state.get('contentTypeDetectionRequestId');

  if (status === DETECTING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      contentTypeDetectionStatus: FAILURE_STATUS,
      contentTypeDetectionRequestId: null,
      contentType: null,
      contentTypeError: action.payload.message,
    });
  }

  return state;
};

/**
 * Root reducer for this plugin.
 */
const reducers = {
  [EDITOR_CONTENT_TYPE_DETECT_STARTED]: detectContentStartedReducer,
  [EDITOR_CONTENT_TYPE_DETECT_SUCCESS]: detectContentSuccessReducer,
  [EDITOR_CONTENT_TYPE_DETECT_FAILURE]: detectContentFailureReducer,
};

export default reducers;
