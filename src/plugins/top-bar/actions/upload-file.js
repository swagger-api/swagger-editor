import fileDialog from 'file-dialog';

/**
 * Action types.
 */
export const EDITOR_UPLOAD_FILE_STARTED = 'editor_upload_file_started';
export const EDITOR_UPLOAD_FILE_SUCCESS = 'editor_upload_file_success';
export const EDITOR_UPLOAD_FILE_FAILURE = 'editor_upload_file_failure';

/**
 * Action creators.
 */
export const uploadFileStarted = ({ requestId }) => ({
  type: EDITOR_UPLOAD_FILE_STARTED,
  meta: { requestId },
});

export const uploadFileSuccess = ({ content, file, requestId }) => ({
  type: EDITOR_UPLOAD_FILE_SUCCESS,
  payload: content,
  meta: { file, requestId },
});

export const uploadFileFailure = ({ error, requestId }) => {
  return {
    type: EDITOR_UPLOAD_FILE_FAILURE,
    payload: error,
    error: true,
    meta: { requestId },
  };
};

/**
 * Async thunks.
 */
export const uploadFile = () => async (system) => {
  const { editorActions, fn } = system;
  const requestId = fn.generateRequestId();

  editorActions.uploadFileStarted({ requestId });

  try {
    const [file] = await fileDialog({ multiple: false });
    const content = await file.text();

    return editorActions.uploadFileSuccess({
      content,
      file,
      requestId,
    });
  } catch (error) {
    return editorActions.uploadFileFailure({
      error,
      requestId,
    });
  }
};
