import { createSelector } from 'reselect';

import {
  IDLE_STATUS,
  PARSING_STATUS,
  SUCCESS_STATUS,
  FAILURE_STATUS,
  initialState,
} from './reducers.js';

const selectState = (state) => state;

export const selectParseStatus = (state) => state.get('parseStatus', IDLE_STATUS);

export const selectParseResult = createSelector(selectState, (state) => {
  return state.get('parseResult', initialState.parseResult);
});

export const selectParseErrors = createSelector(selectState, (state) => {
  const parseErrorsIm = state.get('parseErrors', initialState.parseErrors);

  if (parseErrorsIm === null) {
    return [];
  }

  return parseErrorsIm.toJS();
});

export const selectParseMarkers = createSelector(
  selectParseErrors,
  (state, { monaco }) => monaco,
  (state, { modelVersionId }) => modelVersionId,
  (parseErrors, monaco, modelVersionId) => {
    return parseErrors.map((diagnostic) => ({
      message: diagnostic.message,
      startLineNumber: diagnostic.range.start.line + 1,
      endLineNumber: diagnostic.range.end.line + 1,
      startColumn: diagnostic.range.start.character,
      endColumn: diagnostic.range.end.character,
      code: `ASNCPRSR`,
      severity: monaco.MarkerSeverity.Error,
      source: '@asyncapi/parser',
      modelVersionId,
    }));
  }
);

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
