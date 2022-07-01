import { createSelector } from 'reselect';

export const getSpecLineFromPath = createSelector(
  (state) => state.get('foo'),
  (bar) => {
    return bar || [];
  }
);

export const bestJumpPath = createSelector(
  (state) => state.get('foo'),
  (bar) => {
    return bar || [];
  }
);

// legacy:
// import { unescapeJsonPointerToken } from ...
// function jsonPointerToArray
