import ShortUniqueId from 'short-unique-id';
import axios from 'axios';

/**
 * Action types.
 */

export const EDITOR_CONVERT_OPENAPI_2_TO_OPENAPI_30X_STARTED =
  'editor_convert_openapi_2_to_openapi_3_started';
export const EDITOR_CONVERT_OPENAPI_2_TO_OPENAPI_30X_SUCCESS =
  'editor_convert_openapi_2_to_openapi_3_success';
export const EDITOR_CONVERT_OPENAPI_2_TO_OPENAPI_30X_FAILURE =
  'editor_convert_openapi_2_to_openapi_3_failure';

/**
 * Action creators.
 */

export const convertOpenAPI20ToOpenAPI30xStarted = ({ openAPI2Content, requestId }) => ({
  type: EDITOR_CONVERT_OPENAPI_2_TO_OPENAPI_30X_STARTED,
  payload: openAPI2Content,
  meta: {
    requestId,
  },
});

export const convertOpenAPI20ToOpenAPI30xSuccess = ({
  openAPI30xContent,
  openAPI2Content,
  requestId,
}) => ({
  type: EDITOR_CONVERT_OPENAPI_2_TO_OPENAPI_30X_SUCCESS,
  payload: openAPI30xContent,
  meta: { openAPI2Content, requestId },
});

export const convertOpenAPI20ToOpenAPI30xFailure = ({ error, openAPI2Content, requestId }) => {
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
    type: EDITOR_CONVERT_OPENAPI_2_TO_OPENAPI_30X_FAILURE,
    payload: error,
    error: true,
    meta: { openAPI2Content, errorMessage, requestId },
  };
};

/**
 * Async thunks.
 */

export const convertOpenAPI20ToOpenAPI30x = ({ openAPI2Content, contentType }) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorActions, editorSelectors } = system;
    const { swagger2ConverterUrl: openAPI20ConverterURL } = system.getConfigs();
    const converterURL = openAPI20ConverterURL ?? editorSelectors.selectOpenAPI20ConverterURL();
    const requestId = uid();

    editorActions.convertOpenAPI20ToOpenAPI30xStarted({ openAPI2Content, requestId });

    try {
      const response = await axios.post(converterURL, openAPI2Content, {
        headers: {
          'Content-Type': contentType,
          Accept: contentType,
        },
      });

      const openAPI30xContent =
        contentType === 'application/json'
          ? JSON.stringify(response.data, null, 2) // converter service returns ugly JSON string
          : response.request.responseText;

      return editorActions.convertOpenAPI20ToOpenAPI30xSuccess({
        openAPI30xContent,
        openAPI2Content,
        requestId,
      });
    } catch (error) {
      return editorActions.convertOpenAPI20ToOpenAPI30xFailure({
        error,
        openAPI2Content,
        requestId,
      });
    }
  };
};
