import { compile } from '@swagger-api/apidom-json-pointer';

export const EDITOR_PREVIEW_SWAGGER_UI_JUMP_TO_PATH_STARTED =
  'editor_preview_swagger_ui_jump_to_path_started';
export const EDITOR_PREVIEW_SWAGGER_UI_JUMP_TO_PATH_SUCCESS =
  'editor_preview_swagger_ui_jump_to_path_success';
export const EDITOR_PREVIEW_SWAGGER_UI_JUMP_TO_PATH_FAILURE =
  'editor_preview_swagger_ui_jump_to_path_failure';

export const jumpToPathStarted = ({ path, requestId }) => ({
  type: EDITOR_PREVIEW_SWAGGER_UI_JUMP_TO_PATH_STARTED,
  payload: path,
  meta: { requestId },
});

export const jumpToPathSuccess = ({ position, path, jsonPointer, requestId }) => ({
  type: EDITOR_PREVIEW_SWAGGER_UI_JUMP_TO_PATH_SUCCESS,
  payload: position,
  meta: { jsonPointer, path, requestId },
});

export const jumpToPathFailure = ({ error, path, jsonPointer, requestId }) => ({
  type: EDITOR_PREVIEW_SWAGGER_UI_JUMP_TO_PATH_FAILURE,
  error: true,
  payload: error,
  meta: { jsonPointer, path, requestId },
});

export const jumpToPath = (path) => async (system) => {
  const { editorActions, editorPreviewSwaggerUIActions, fn } = system;
  const requestId = fn.generateRequestId();
  let jsonPointer = '';

  editorPreviewSwaggerUIActions.jumpToPathStarted({ path, requestId });

  try {
    jsonPointer = compile(path);
    const getJsonPointerPositionFSA = await editorActions.getJsonPointerPosition(jsonPointer);

    if (getJsonPointerPositionFSA.error) {
      throw getJsonPointerPositionFSA;
    }

    const { payload: position } = getJsonPointerPositionFSA;
    const setPositionActionFSA = await editorActions.setPosition(position);

    if (setPositionActionFSA.error) {
      throw setPositionActionFSA;
    }

    return editorPreviewSwaggerUIActions.jumpToPathSuccess({
      path,
      jsonPointer,
      position,
      requestId,
    });
  } catch (error) {
    return editorPreviewSwaggerUIActions.jumpToPathFailure({
      error,
      path,
      jsonPointer,
      requestId,
    });
  }
};
