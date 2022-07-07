import ShortUniqueId from 'short-unique-id';
import axios from 'axios';

/**
 * Action types.
 */

export const EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_STARTED =
  'editor_top_bar_fetch_openapi3_generator_client_list_started';
export const EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_SUCCESS =
  'editor_top_bar_fetch_openapi3_generator_client_list_success';
export const EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_FAILURE =
  'editor_top_bar_fetch_openapi3_generator_client_list_failure';

/**
 * Action creators.
 */

export const fetchOpenAPI3GeneratorClientListStarted = ({ url, requestId }) => ({
  type: EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_STARTED,
  meta: {
    url,
    requestId,
  },
});

export const fetchOpenAPI3GeneratorClientListSuccess = ({ clientList, url, requestId }) => ({
  type: EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_SUCCESS,
  payload: clientList,
  meta: { url, requestId },
});

export const fetchOpenAPI3GeneratorClientListFailure = ({ error, url, requestId }) => {
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
    type: EDITOR_TOP_BAR_FETCH_OPENAPI3_GENERATOR_CLIENT_LIST_FAILURE,
    payload: error,
    error: true,
    meta: { errorMessage, url, requestId },
  };
};

/**
 * Async thunks.
 */

export const fetchOpenAPI3GeneratorClientList = () => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorTopBarActions, editorTopBarSelectors } = system;
    const requestId = uid();
    const url = editorTopBarSelectors.selectOpenAPI3GeneratorClientListURL();

    editorTopBarActions.fetchOpenAPI3GeneratorClientListStarted({ url, requestId });

    try {
      const response = await axios.get(url);
      return editorTopBarActions.fetchOpenAPI3GeneratorClientListSuccess({
        clientList: response.data,
        url,
        requestId,
      });
    } catch (error) {
      return editorTopBarActions.fetchOpenAPI3GeneratorClientListFailure({ error, url, requestId });
    }
  };
};
