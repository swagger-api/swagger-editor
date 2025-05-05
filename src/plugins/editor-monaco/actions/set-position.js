export const EDITOR_SET_POSITION_STARTED = 'editor_set_position_started';
export const EDITOR_SET_POSITION_SUCCESS = 'editor_set_position_success';
export const EDITOR_SET_POSITION_FAILURE = 'editor_set_position_failure';

export const setPositionStarted = ({ lineNumber, column, options, requestId }) => ({
  type: EDITOR_SET_POSITION_STARTED,
  payload: { lineNumber, column },
  meta: { options, requestId },
});

export const setPositionSuccess = ({ lineNumber, column, options, requestId }) => ({
  type: EDITOR_SET_POSITION_SUCCESS,
  payload: { lineNumber, column },
  meta: { options, requestId },
});

export const setPositionFailure = ({ lineNumber, column, options, error, requestId }) => ({
  type: EDITOR_SET_POSITION_FAILURE,
  error: true,
  payload: error,
  meta: { lineNumber, column, options, requestId },
});

export const setPosition =
  ({ lineNumber = 0, column = 0 } = {}, options = { scroll: true }) =>
  (system) => {
    const { editorActions, editorSelectors, fn } = system;
    const requestId = fn.generateRequestId();

    editorActions.setPositionStarted({ lineNumber, column, options, requestId });

    try {
      const editor = editorSelectors.selectEditor();

      if (options.scroll) {
        editor.revealPositionNearTop({ lineNumber, column });
      }

      editor.setPosition({ lineNumber, column });
      editor.focus();

      return editorActions.setPositionSuccess({ lineNumber, column, options, requestId });
    } catch (error) {
      return editorActions.setPositionFailure({ error, lineNumber, column, options, requestId });
    }
  };
