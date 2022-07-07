import { AsyncAPIDocument } from '@asyncapi/parser';
import { createSelector } from 'reselect';

import {
  IDLE_STATUS,
  PARSING_STATUS,
  SUCCESS_STATUS,
  FAILURE_STATUS,
  initialState,
} from './reducers.js';

const selectState = (state) => state;

export const selectParserMarkers = createSelector(selectState, (state) => {
  return state.get('parserMarkers') || [];
});

export const selectParseStatus = (state) => state.get('parseStatus') || IDLE_STATUS;

export const selectParseResult = createSelector(selectState, (state) => {
  const parseResult = state.get('parseResult', initialState.parseResult);

  if (typeof parseResult !== 'string') {
    return null;
  }

  return AsyncAPIDocument.parse(state.get('parseResult'));
});

export const selectParseErrors = createSelector(selectState, (state) => {
  const parseErrorsIm = state.get('parseErrors', initialState.parseResult);

  if (parseErrorsIm === null) {
    return [];
  }

  return parseErrorsIm.toJS();
});

export const selectIsParseInProgress = createSelector(
  selectParseStatus,
  selectParseResult,
  selectParseErrors,
  (parseStatus, parseResult, parseErrors) => {
    return parseStatus === PARSING_STATUS && parseResult === null && parseErrors === null;
  }
);

export const selectIsParseSuccess = createSelector(
  selectParseStatus,
  (parseStatus) => parseStatus === SUCCESS_STATUS
);

export const selectIsParseFailure = createSelector(
  selectParseStatus,
  (parseStatus) => parseStatus === FAILURE_STATUS
);
