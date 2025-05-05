export const EDITOR_MONACO_LANGUAGE_APIDOM_GET_JSON_POINTER_POSITION_STARTED =
  'editor_monaco_language_apidom_get_json_pointer_position_started';

export const EDITOR_MONACO_LANGUAGE_APIDOM_GET_JSON_POINTER_POSITION_SUCCESS =
  'editor_monaco_language_apidom_get_json_pointer_position_success';

export const EDITOR_MONACO_LANGUAGE_APIDOM_GET_JSON_POINTER_POSITION_FAILURE =
  'editor_monaco_language_apidom_get_json_pointer_position_failure';

export const getJsonPointerPositionStarted = ({ jsonPointer, requestId }) => ({
  type: EDITOR_MONACO_LANGUAGE_APIDOM_GET_JSON_POINTER_POSITION_STARTED,
  payload: jsonPointer,
  meta: { requestId },
});

export const getJsonPointerPositionSuccess = ({ position, jsonPointer, requestId }) => ({
  type: EDITOR_MONACO_LANGUAGE_APIDOM_GET_JSON_POINTER_POSITION_SUCCESS,
  payload: position,
  meta: { jsonPointer, requestId },
});

export const getJsonPointerPositionFailure = ({ error, jsonPointer, requestId }) => ({
  type: EDITOR_MONACO_LANGUAGE_APIDOM_GET_JSON_POINTER_POSITION_FAILURE,
  error: true,
  payload: error,
  meta: { jsonPointer, requestId },
});

export const getJsonPointerPosition = (jsonPointer) => async (system) => {
  const { editorActions, editorSelectors, fn } = system;
  const requestId = fn.generateRequestId();

  editorActions.getJsonPointerPositionStarted({ jsonPointer, requestId });

  try {
    const editor = editorSelectors.selectEditor();
    const model = editor.getModel();
    const worker = await fn.getApiDOMWorker()(model.uri);
    const { line, character } = await worker.getJsonPointerPosition(
      model.uri.toString(),
      jsonPointer
    );
    const position = { lineNumber: line, column: character - 1 };

    return editorActions.getJsonPointerPositionSuccess({ position, jsonPointer, requestId });
  } catch (error) {
    return editorActions.getJsonPointerPositionFailure({ error, jsonPointer, requestId });
  }
};
