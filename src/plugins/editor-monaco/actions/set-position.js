export const EDITOR_SET_POSITION_STARTED = 'editor_set_position_started';
export const EDITOR_SET_POSITION_SUCCESS = 'editor_set_position_success';
export const EDITOR_SET_POSITION_FAILURE = 'editor_set_position_failure';

export const setPositionStarted = ({ lineNumber, column }) => ({
  type: EDITOR_SET_POSITION_STARTED,
  payload: { lineNumber, column },
});

export const setPositionSuccess = ({ lineNumber, column }) => ({
  type: EDITOR_SET_POSITION_SUCCESS,
  payload: { lineNumber, column },
});

export const setPositionFailure = ({ lineNumber, column, error }) => ({
  type: EDITOR_SET_POSITION_FAILURE,
  error: true,
  payload: error,
  meta: { lineNumber, column },
});

export const setPosition =
  ({ lineNumber = 0, column = 0 } = {}) =>
  (system) => {
    const { editorActions, editorSelectors } = system;

    editorActions.setPositionStarted({ lineNumber, column });

    try {
      const editor = editorSelectors.selectEditor();

      editor.revealPositionNearTop({ lineNumber, column });
      editor.setPosition({ lineNumber, column });
      editor.focus();

      return editorActions.setPositionSuccess({ lineNumber, column });
    } catch (error) {
      return editorActions.setPositionFailure({ error, lineNumber, column });
    }
  };
