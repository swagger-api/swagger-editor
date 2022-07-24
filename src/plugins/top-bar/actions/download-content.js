import fileDownload from 'js-file-download';
import ShortUniqueId from 'short-unique-id';

/**
 * Action types.
 */

export const EDITOR_DOWNLOAD_CONTENT_STARTED = 'editor_download_content_started';
export const EDITOR_DOWNLOAD_CONTENT_SUCCESS = 'editor_download_content_success';
export const EDITOR_DOWNLOAD_CONTENT_FAILURE = 'editor_download_content_failure';

/**
 * Action creators.
 */

export const downloadContentStarted = ({ content, fileNameWithExtension, requestId }) => ({
  type: EDITOR_DOWNLOAD_CONTENT_STARTED,
  payload: content,
  meta: {
    requestId,
    fileNameWithExtension,
  },
});

export const downloadContentSuccess = ({ fileNameWithExtension, content, requestId }) => ({
  type: EDITOR_DOWNLOAD_CONTENT_SUCCESS,
  payload: fileNameWithExtension,
  meta: { content, requestId },
});

export const downloadContentFailure = ({ error, content, fileNameWithExtension, requestId }) => {
  const errorMessage = error.message || 'Unknown error while downloading editor content';

  return {
    type: EDITOR_DOWNLOAD_CONTENT_FAILURE,
    payload: error,
    error: true,
    meta: { content, errorMessage, fileNameWithExtension, requestId },
  };
};

/**
 * Async thunks.
 */

export const downloadContent = ({ content, fileNameWithExtension }) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorActions } = system;
    const requestId = uid();

    editorActions.downloadContentStarted({ content, fileNameWithExtension, requestId });

    try {
      fileDownload(content, fileNameWithExtension);
      return editorActions.downloadContentSuccess({
        fileNameWithExtension,
        content,
        requestId,
      });
    } catch (error) {
      return editorActions.downloadContentFailure({
        error,
        content,
        fileNameWithExtension,
        requestId,
      });
    }
  };
};
