import { List } from 'immutable';

import {
  EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_SERVER_LIST_STARTED,
  EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_SERVER_LIST_SUCCESS,
  EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_SERVER_LIST_FAILURE,
} from './actions/fetch-openapi3-generator-server-list.js';
import {
  EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_STARTED,
  EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_SUCCESS,
  EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_FAILURE,
} from './actions/fetch-openapi3-generator-client-list.js';
import {
  EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_STARTED,
  EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_SUCCESS,
  EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_FAILURE,
} from './actions/fetch-openapi2-generator-server-list.js';
import {
  EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_CLIENT_LIST_STARTED,
  EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_CLIENT_LIST_SUCCESS,
  EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_CLIENT_LIST_FAILURE,
} from './actions/fetch-openapi2-generator-client-list.js';

export const IDLE_STATUS = 'idle';
export const FETCHING_STATUS = 'fetching';
export const SUCCESS_STATUS = 'success';
export const FAILURE_STATUS = 'failure';

export const initialState = {
  openAPI3GeneratorServerList: null,
  openAPI3GeneratorServerListError: null,
  openAPI3GeneratorServerListStatus: IDLE_STATUS,
  openAPI3GeneratorServerListRequestId: null,

  openAPI3GeneratorClientList: null,
  openAPI3GeneratorClientListError: null,
  openAPI3GeneratorClientListStatus: IDLE_STATUS,
  openAPI3GeneratorClientListRequestId: null,

  openAPI2GeneratorServerList: null,
  openAPI2GeneratorServerListError: null,
  openAPI2GeneratorServerListStatus: IDLE_STATUS,
  openAPI2GeneratorServerListRequestId: null,

  openAPI2GeneratorClientList: null,
  openAPI2GeneratorClientListError: null,
  openAPI2GeneratorClientListStatus: IDLE_STATUS,
  openAPI2GeneratorClientListRequestId: null,
};

/**
 * Case reducers modeled as finite state machine.
 */

const fetchOpenAPI3GeneratorServerListStartedReducer = (state, action) => {
  const status = state.get('openAPI3GeneratorServerListStatus') || IDLE_STATUS;

  if (status !== FETCHING_STATUS) {
    return state.merge({
      openAPI3GeneratorServerListStatus: FETCHING_STATUS,
      openAPI3GeneratorServerListRequestId: action.meta.requestId,
    });
  }

  return state;
};

const fetchOpenAPI3GeneratorServerListSuccessReducer = (state, action) => {
  const status = state.get('openAPI3GeneratorServerListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI3GeneratorServerListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI3GeneratorServerListStatus: SUCCESS_STATUS,
      openAPI3GeneratorServerList: List.of(...action.payload),
      openAPI3GeneratorServerListError: null,
      openAPI3GeneratorServerListRequestId: null,
    });
  }

  return state;
};

const fetchOpenAPI3GeneratorServerListFailureReducer = (state, action) => {
  const status = state.get('openAPI3GeneratorServerListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI3GeneratorServerListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI3GeneratorServerListStatus: FAILURE_STATUS,
      openAPI3GeneratorServerList: null,
      openAPI3GeneratorServerListError: action.payload,
      openAPI3GeneratorServerListRequestId: null,
    });
  }

  return state;
};

const fetchOpenAPI3GeneratorClientListStartedReducer = (state, action) => {
  const status = state.get('openAPI3GeneratorClientListStatus') || IDLE_STATUS;

  if (status !== FETCHING_STATUS) {
    return state.merge({
      openAPI3GeneratorClientListStatus: FETCHING_STATUS,
      openAPI3GeneratorClientListRequestId: action.meta.requestId,
    });
  }

  return state;
};

const fetchOpenAPI3GeneratorClientListSuccessReducer = (state, action) => {
  const status = state.get('openAPI3GeneratorClientListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI3GeneratorClientListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI3GeneratorClientListStatus: SUCCESS_STATUS,
      openAPI3GeneratorClientList: List.of(...action.payload),
      openAPI3GeneratorClientListError: null,
      openAPI3GeneratorClientListRequestId: null,
    });
  }

  return state;
};

const fetchOpenAPI3GeneratorClientListFailureReducer = (state, action) => {
  const status = state.get('openAPI3GeneratorClientListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI3GeneratorClientListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI3GeneratorClientListStatus: FAILURE_STATUS,
      openAPI3GeneratorClientList: null,
      openAPI3GeneratorClientListError: action.payload,
      openAPI3GeneratorClientListRequestId: null,
    });
  }

  return state;
};

const fetchOpenAPI2GeneratorServerListStartedReducer = (state, action) => {
  const status = state.get('openAPI2GeneratorServerListStatus') || IDLE_STATUS;

  if (status !== FETCHING_STATUS) {
    return state.merge({
      openAPI2GeneratorServerListStatus: FETCHING_STATUS,
      openAPI2GeneratorServerListRequestId: action.meta.requestId,
    });
  }

  return state;
};

const fetchOpenAPI2GeneratorServerListSuccessReducer = (state, action) => {
  const status = state.get('openAPI2GeneratorServerListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI2GeneratorServerListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI2GeneratorServerListStatus: SUCCESS_STATUS,
      openAPI2GeneratorServerList: List.of(...action.payload),
      openAPI2GeneratorServerListError: null,
      openAPI2GeneratorServerListRequestId: null,
    });
  }

  return state;
};

const fetchOpenAPI2GeneratorServerListFailureReducer = (state, action) => {
  const status = state.get('openAPI2GeneratorServerListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI2GeneratorServerListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI2GeneratorServerListStatus: FAILURE_STATUS,
      openAPI2GeneratorServerList: null,
      openAPI2GeneratorServerListError: action.payload,
      openAPI2GeneratorServerListRequestId: null,
    });
  }

  return state;
};

const fetchOpenAPI2GeneratorClientListStartedReducer = (state, action) => {
  const status = state.get('openAPI2GeneratorClientListStatus') || IDLE_STATUS;

  if (status !== FETCHING_STATUS) {
    return state.merge({
      openAPI2GeneratorClientListStatus: FETCHING_STATUS,
      openAPI2GeneratorClientListRequestId: action.meta.requestId,
    });
  }

  return state;
};

const fetchOpenAPI2GeneratorClientListSuccessReducer = (state, action) => {
  const status = state.get('openAPI2GeneratorClientListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI2GeneratorClientListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI2GeneratorClientListStatus: SUCCESS_STATUS,
      openAPI2GeneratorClientList: List.of(...action.payload),
      openAPI2GeneratorClientListError: null,
      openAPI2GeneratorClientListRequestId: null,
    });
  }

  return state;
};

const fetchOpenAPI2GeneratorClientListFailureReducer = (state, action) => {
  const status = state.get('openAPI2GeneratorClientListStatus') || IDLE_STATUS;
  const requestId = state.get('openAPI2GeneratorClientListRequestId');

  if (status === FETCHING_STATUS && requestId === action.meta.requestId) {
    return state.merge({
      openAPI2GeneratorClientListStatus: FAILURE_STATUS,
      openAPI2GeneratorClientList: null,
      openAPI2GeneratorClientListError: action.payload,
      openAPI2GeneratorClientListRequestId: null,
    });
  }

  return state;
};

/**
 * Root reducer for this plugin.
 */

export default {
  [EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_SERVER_LIST_STARTED]:
    fetchOpenAPI3GeneratorServerListStartedReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_SERVER_LIST_SUCCESS]:
    fetchOpenAPI3GeneratorServerListSuccessReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_SERVER_LIST_FAILURE]:
    fetchOpenAPI3GeneratorServerListFailureReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_STARTED]:
    fetchOpenAPI3GeneratorClientListStartedReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_SUCCESS]:
    fetchOpenAPI3GeneratorClientListSuccessReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_FAILURE]:
    fetchOpenAPI3GeneratorClientListFailureReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_STARTED]:
    fetchOpenAPI2GeneratorServerListStartedReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_SUCCESS]:
    fetchOpenAPI2GeneratorServerListSuccessReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_FAILURE]:
    fetchOpenAPI2GeneratorServerListFailureReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_CLIENT_LIST_STARTED]:
    fetchOpenAPI2GeneratorClientListStartedReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_CLIENT_LIST_SUCCESS]:
    fetchOpenAPI2GeneratorClientListSuccessReducer,
  [EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_CLIENT_LIST_FAILURE]:
    fetchOpenAPI2GeneratorClientListFailureReducer,
};
