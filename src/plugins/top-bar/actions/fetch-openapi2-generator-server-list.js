import ShortUniqueId from 'short-unique-id';
import axios from 'axios';

/**
 * Action types.
 */

export const EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_STARTED =
  'editor_top_bar_fetch_openapi2_generator_server_list_started';
export const EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_SUCCESS =
  'editor_top_bar_fetch_openapi2_generator_server_list_success';
export const EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_FAILURE =
  'editor_top_bar_fetch_openapi2_generator_server_list_failure';

/**
 * Action creators.
 */

export const fetchOpenAPI2GeneratorServerListStarted = ({ url, requestId }) => ({
  type: EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_STARTED,
  meta: {
    url,
    requestId,
  },
});

export const fetchOpenAPI2GeneratorServerListSuccess = ({ serverList, url, requestId }) => ({
  type: EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_SUCCESS,
  payload: serverList,
  meta: { url, requestId },
});

export const fetchOpenAPI2GeneratorServerListFailure = ({ error, url, requestId }) => {
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
    type: EDITOR_TOP_BAR_FETCH_OPENAPI2_GENERATOR_SERVER_LIST_FAILURE,
    payload: error,
    error: true,
    meta: { errorMessage, url, requestId },
  };
};

/**
 * Async thunks.
 */

export const fetchOpenAPI2GeneratorServerList = () => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorTopBarActions, editorTopBarSelectors } = system;
    const requestId = uid();
    const url = editorTopBarSelectors.selectOpenAPI2GeneratorServerListURL();

    editorTopBarActions.fetchOpenAPI2GeneratorServerListStarted({ url, requestId });

    try {
      const response = await axios.get(url);
      return editorTopBarActions.fetchOpenAPI2GeneratorServerListSuccess({
        serverList: response.data,
        url,
        requestId,
      });
    } catch (error) {
      return editorTopBarActions.fetchOpenAPI2GeneratorServerListFailure({ error, url, requestId });
    }
  };
};
