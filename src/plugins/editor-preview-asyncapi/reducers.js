import { AsyncAPIDocument } from '@asyncapi/parser';
import uniqWith from 'lodash/uniqWith.js';
import { fromJS } from 'immutable';

import {
  EDITOR_PREVIEW_ASYNCAPI_PREVIEW_UNMOUNTED,
  EDITOR_PREVIEW_ASYNCAPI_PARSE_STARTED,
  EDITOR_PREVIEW_ASYNCAPI_PARSE_SUCCESS,
  EDITOR_PREVIEW_ASYNCAPI_PARSE_FAILURE,
} from './actions.js';

export const IDLE_STATUS = 'idle';
export const PARSING_STATUS = 'parsing';
export const SUCCESS_STATUS = 'success';
export const FAILURE_STATUS = 'failure';

export const initialState = {
  parserMarkers: [],
  parseStatus: IDLE_STATUS,
  parseRequestId: null,
  parseResult: null,
  parseErrors: null,
};

/**
 * Reducer utils.
 */

const parseValidationErrorsReducer = (action) => {
  const { payload: error } = action;

  if (!(Array.isArray(error.validationErrors) && error.validationErrors.length > 0)) return [];

  return error.validationErrors.map((validationError) => ({
    message: validationError.title,
    startLineNumber: validationError.location.startLine,
    endLineNumber: validationError.location.endLine,
    startColumn: validationError.location.startColumn,
    endColumn: validationError.location.endColumn,
    jsonPointer: validationError.location.jsonPointer,
  }));
};

const parseRefErrorsReducer = (action) => {
  const { payload: error } = action;

  if (!(Array.isArray(error.refs) && error.refs.length > 0)) return [];

  return error.refs.map((refError, index) => {
    const message = index === 0 ? error.title : 'Invalid JSON Reference';

    return {
      message,
      startLineNumber: refError.startLine,
      endLineNumber: refError.endLine,
      startColumn: refError.startColumn,
      endColumn: refError.endColumn,
      jsonPointer: refError.jsonPointer,
    };
  });
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
      parseResult: AsyncAPIDocument.stringify(action.payload),
      parseErrors: null,
    });
  }

  return state;
};

const parseFailureReducer = (state, action) => {
  const status = state.get('parseStatus') || IDLE_STATUS;
  const requestId = state.get('parseRequestId');

  if (status === PARSING_STATUS && requestId === action.meta.requestId) {
    const validationErrors = parseValidationErrorsReducer(action);
    const refErrors = parseRefErrorsReducer(action);
    const parseErrors = uniqWith([...validationErrors, ...refErrors], (arrVal, othVal) => {
      return (
        arrVal.message === othVal.message &&
        arrVal.startLineNumber === othVal.startLineNumber &&
        arrVal.startColumn === othVal.startColumn
      );
    });

    return state.merge({
      parseStatus: FAILURE_STATUS,
      parseRequestId: null,
      parseResult: null,
      parseErrors: fromJS(parseErrors),
    });
  }

  return state;
};

/**
 * Root reducer for this plugin.
 */

const reducers = {
  [EDITOR_PREVIEW_ASYNCAPI_PREVIEW_UNMOUNTED]: previewUnmountedReducer,

  [EDITOR_PREVIEW_ASYNCAPI_PARSE_STARTED]: parseStartedReducer,
  [EDITOR_PREVIEW_ASYNCAPI_PARSE_SUCCESS]: parseSuccessReducer,
  [EDITOR_PREVIEW_ASYNCAPI_PARSE_FAILURE]: parseFailureReducer,
};

export default reducers;
