import ShortUniqueId from 'short-unique-id';
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

export const importUrlSuccess = ({ definition, requestId }) => ({
  type: EDITOR_IMPORT_URL_SUCCESS,
  payload: definition,
  meta: { requestId },
});

export const importUrlFailure = ({ error, url, requestId }) => {
  /* eslint-disable no-nested-ternary */
  const errorMessage = error.response
    ? 'The request was made and the server responded with a status code that falls out of the range of 2xx'
    : error.request
    ? 'The request was made but no response was received'
    : error.message
    ? error.message
    : 'Unknown error occurred';
  /* eslint-enable */

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

export const importUrl = (url) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorActions } = system;
    const requestId = uid();

    editorActions.importUrlStarted({ url, requestId });

    try {
      const response = await axios.get(url);
      return editorActions.importUrlSuccess({
        definition: response.request.responseText,
        requestId,
      });
    } catch (error) {
      return editorActions.importUrlFailure({ error, url, requestId });
    }
  };
};
