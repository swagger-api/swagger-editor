import { fromJS } from 'immutable';

import { EDITOR_TRANSFORM_DIALOG_OPEN_SUCCESS, EDITOR_TRANSFORM_DIALOG_CLOSE } from './actions.js';

export const initialState = {
  isTransformDialogOpen: false,
  clipboardData: null,
  clipboardRange: null,
};

const reducers = {
  [EDITOR_TRANSFORM_DIALOG_OPEN_SUCCESS]: (state, action) => {
    return state.merge({
      isTransformDialogOpen: true,
      clipboardData: action.payload,
      clipboardRange: fromJS({
        startLineNumber: action.meta.range.startLineNumber,
        startColumn: action.meta.range.startColumn,
        endLineNumber: action.meta.range.endLineNumber,
        endColumn: action.meta.range.endColumn,
      }),
    });
  },
  [EDITOR_TRANSFORM_DIALOG_CLOSE]: (state) => {
    return state.merge({
      isTransformDialogOpen: false,
      clipboardData: initialState.clipboardData,
      clipboardRange: initialState.clipboardRange,
    });
  },
};

export default reducers;
