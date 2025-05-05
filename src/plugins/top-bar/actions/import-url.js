import axios from 'axios';

/**
 * Action types.
 */

export const EDITOR_IMPORT_URL_STARTED = 'editor_import_url_started';
export const EDITOR_IMPORT_URL_SUCCESS = 'editor_import_url_success';
export const EDITOR_IMPORT_URL_FAILURE = 'editor_import_url_failure';

/**
 * Action creators.
 */

export const importUrlStarted = ({ url, requestId }) => ({
  type: EDITOR_IMPORT_URL_STARTED,
  payload: url,
  meta: {
    requestId,
  },
});

export const importUrlSuccess = ({ definition, requestId, url }) => ({
  type: EDITOR_IMPORT_URL_SUCCESS,
  payload: definition,
  meta: { requestId, url },
});

export const importUrlFailure = ({ error, url, requestId }) => {
  const errorMessage = error.response
    ? 'The request was made and the server responded with a status code that falls out of the range of 2xx'
    : error.request
      ? 'The request was made but no response was received'
      : error.message
        ? error.message
        : 'Unknown error occurred';

  return {
    type: EDITOR_IMPORT_URL_FAILURE,
    payload: error,
    error: true,
    meta: { url, errorMessage, requestId },
  };
};

/**
 * Async thunks.
 */
export const importUrl = (url) => async (system) => {
  const { editorActions, fn } = system;
  const requestId = fn.generateRequestId();
  const sanitizedUrl = fn.sanitizeUrl(url);

  editorActions.importUrlStarted({ url: sanitizedUrl, requestId });

  if (sanitizedUrl === 'about:blank') {
    return editorActions.importUrlFailure({
      error: new Error('Invalid url provided'),
      url: sanitizedUrl,
      requestId,
    });
  }

  try {
    const response = await axios.get(sanitizedUrl);
    return editorActions.importUrlSuccess({
      definition: response.request.responseText,
      requestId,
      url: sanitizedUrl,
    });
  } catch (error) {
    return editorActions.importUrlFailure({ error, url: sanitizedUrl, requestId });
  }
};
