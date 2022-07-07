import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import YAML from 'js-yaml';
import fileDownload from 'js-file-download';

/**
 * Action types.
 */

export const EDITOR_TOP_BAR_GENERATE_CLIENT_CODE_FROM_OPENAPI3_STARTED =
  'editor_top_bar_generate_client_code_from_openapi3_started';
export const EDITOR_TOP_BAR_GENERATE_CLIENT_CODE_FROM_OPENAPI3_SUCCESS =
  'editor_top_bar_generate_client_code_from_openapi3_success';
export const EDITOR_TOP_BAR_GENERATE_CLIENT_CODE_FROM_OPENAPI3_FAILURE =
  'editor_top_bar_generate_client_code_from_openapi3_failure';

/**
 * Action creators.
 */

export const generateClientCodeFromOpenAPI3Started = ({ content, language, requestId }) => ({
  type: EDITOR_TOP_BAR_GENERATE_CLIENT_CODE_FROM_OPENAPI3_STARTED,
  payload: content,
  meta: {
    language,
    requestId,
  },
});

export const generateClientCodeFromOpenAPI3Success = ({
  blob,
  content,
  language,
  fileNameWithExtension,
  requestId,
}) => ({
  type: EDITOR_TOP_BAR_GENERATE_CLIENT_CODE_FROM_OPENAPI3_SUCCESS,
  payload: blob,
  meta: { content, language, fileNameWithExtension, requestId },
});

export const generateClientCodeFromOpenAPI3Failure = ({ error, content, language, requestId }) => {
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
    type: EDITOR_TOP_BAR_GENERATE_CLIENT_CODE_FROM_OPENAPI3_FAILURE,
    payload: error,
    error: true,
    meta: { errorMessage, content, language, requestId },
  };
};

/**
 * Async thunks.
 */

export const generateClientCodeFromOpenAPI3 = ({ content, language }) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorTopBarActions, editorTopBarSelectors } = system;
    const requestId = uid();
    const url = editorTopBarSelectors.selectOpenAPI3GenerateClientURL();
    const fileNameWithExtension = `${language}-client-generated.zip`;

    editorTopBarActions.generateClientCodeFromOpenAPI3Started({ content, language, requestId });

    try {
      const data = { spec: YAML.load(content), lang: language, type: 'CLIENT' };
      const response = await axios.post(url, data, {
        responseType: 'blob',
      });

      fileDownload(response.data, fileNameWithExtension);

      return editorTopBarActions.generateClientCodeFromOpenAPI3Success({
        blob: response.data,
        fileNameWithExtension,
        content,
        language,
        requestId,
      });
    } catch (error) {
      return editorTopBarActions.generateClientCodeFromOpenAPI3Failure({
        error,
        content,
        language,
        requestId,
      });
    }
  };
};
