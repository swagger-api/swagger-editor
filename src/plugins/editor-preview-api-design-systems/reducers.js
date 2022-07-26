import { toString } from '@swagger-api/apidom-core';

import apiDesignSystemsNamespace from './namespace.js';
import {
  EDITOR_PREVIEW_ADS_PREVIEW_UNMOUNTED,
  EDITOR_PREVIEW_ADS_PARSE_STARTED,
  EDITOR_PREVIEW_ADS_PARSE_SUCCESS,
  EDITOR_PREVIEW_ADS_PARSE_FAILURE,
} from './actions.js';

export const IDLE_STATUS = 'idle';
export const PARSING_STATUS = 'parsing';
export const SUCCESS_STATUS = 'success';
export const FAILURE_STATUS = 'failure';

export const initialState = {
  parseStatus: IDLE_STATUS,
  parseRequestId: null,
  parseResult: null,
  parseError: null,
};

/**
 * Case reducers modeled as finite state machine.
 */

const previewUnmountedReducer = (state) => {
  const { parseStatus, parseRequestId, parseResult, parseErrors } = initialState;

  return state.merge({
    parseStatus,
    parseRequestId,
    parseResult,
    parseErrors,
  });
};

const parseStartedReducer = (state, action) => {
  return state.merge({
    parseStatus: PARSING_STATUS,
    parseRequestId: action.meta.requestId,
  });
};

const parseSuccessReducer = (state, action) => {
  const status = state.get('parseStatus') || IDLE_STATUS;
  const requestId = state.get('parseRequestId');

  if (status === PARSING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      parseStatus: SUCCESS_STATUS,
      parseRequestId: null,
      parseResult: toString(action.payload, apiDesignSystemsNamespace),
      parseErrors: null,
    });
  }

  return state;
};

const parseFailureReducer = (state, action) => {
  const status = state.get('parseStatus') || IDLE_STATUS;
  const requestId = state.get('parseRequestId');

  if (status === PARSING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      parseStatus: FAILURE_STATUS,
      parseRequestId: null,
      parseResult: null,
      parseErrors: action.payload,
    });
  }

  return state;
};

/**
 * Root reducer for this plugin.
 */

const reducers = {
  [EDITOR_PREVIEW_ADS_PREVIEW_UNMOUNTED]: previewUnmountedReducer,

  [EDITOR_PREVIEW_ADS_PARSE_STARTED]: parseStartedReducer,
  [EDITOR_PREVIEW_ADS_PARSE_SUCCESS]: parseSuccessReducer,
  [EDITOR_PREVIEW_ADS_PARSE_FAILURE]: parseFailureReducer,
};

export default reducers;
