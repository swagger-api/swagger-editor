/**
 * Action types.
 */
export const EDITOR_DROPZONE_DROP_FILE_STARTED = 'editor_dropzone_drop_file_started';
export const EDITOR_DROPZONE_DROP_FILE_SUCCESS = 'editor_dropzone_drop_file_success';
export const EDITOR_DROPZONE_DROP_FILE_FAILURE = 'editor_dropzone_drop_file_failure';

/**
 * Action creators.
 */
export const dropFileStarted = ({ file, requestId }) => ({
  type: EDITOR_DROPZONE_DROP_FILE_STARTED,
  payload: file,
  meta: {
    requestId,
  },
});

export const dropFileSuccess = ({ content, file, requestId }) => ({
  type: EDITOR_DROPZONE_DROP_FILE_SUCCESS,
  payload: content,
  meta: { file, requestId },
});

export const dropFileFailure = ({ error, file, requestId }) => ({
  type: EDITOR_DROPZONE_DROP_FILE_FAILURE,
  payload: error,
  error: true,
  meta: { file, requestId },
});

export const dropFile =
  ({ file }) =>
  async (system) => {
    const { editorDropzoneActions, fn } = system;
    const requestId = fn.generateRequestId();

    editorDropzoneActions.dropFileStarted({ file, requestId });

    try {
      const content = await file.text();

      return editorDropzoneActions.dropFileSuccess({
        content,
        file,
        requestId,
      });
    } catch (error) {
      return editorDropzoneActions.dropFileFailure({
        error,
        file,
        requestId,
      });
    }
  };
