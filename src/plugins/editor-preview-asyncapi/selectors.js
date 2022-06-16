/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

export const selectAsyncApiParserMarkers = createSelector(
  (state) => state.get('asyncapiParserMarkers'),
  (asyncapiMarkers) => {
    return asyncapiMarkers || [];
  }
);
