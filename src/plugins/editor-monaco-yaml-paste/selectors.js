import { createSelector } from 'reselect';

import { initialState } from './reducers.js';

export const selectClipboardData = (state) =>
  state.get('clipboardData', initialState.clipboardData);

export const selectClipboardRange = createSelector(
  [
    (state, system) => system.monaco,
    (state) => state.get('clipboardRange', initialState.clipboardRange),
  ],
  (monaco, range) => {
    if (range && monaco) {
      const rangeObj = range.toJS();

      return new monaco.Range(
        rangeObj.startLineNumber,
        rangeObj.startColumn,
        rangeObj.endLineNumber,
        rangeObj.endColumn
      );
    }

    return initialState.clipboardRange;
  }
);

export const selectIsTransformDialogOpen = (state) =>
  state.get('isTransformDialogOpen', initialState.isTransformDialogOpen);
