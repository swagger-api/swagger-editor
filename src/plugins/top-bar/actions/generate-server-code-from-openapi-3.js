import ShortUniqueId from 'short-unique-id';
import axios from 'axios';
import YAML from 'js-yaml';
import fileDownload from 'js-file-download';

/**
 * Action types.
 */

export const EDITOR_TOP_BAR_GENERATE_SERVER_CODE_FROM_OPENAPI3_STARTED =
  'editor_top_bar_generate_server_code_from_openapi3_started';
export const EDITOR_TOP_BAR_GENERATE_SERVER_CODE_FROM_OPENAPI3_SUCCESS =
  'editor_top_bar_generate_server_code_from_openapi3_success';
export const EDITOR_TOP_BAR_GENERATE_SERVER_CODE_FROM_OPENAPI3_FAILURE =
  'editor_top_bar_generate_server_code_from_openapi3_failure';

/**
 * Action creators.
 */

export const generateServerCodeFromOpenAPI3Started = ({ content, framework, requestId }) => ({
  type: EDITOR_TOP_BAR_GENERATE_SERVER_CODE_FROM_OPENAPI3_STARTED,
  payload: content,
  meta: {
    framework,
    requestId,
  },
});

export const generateServerCodeFromOpenAPI3Success = ({
  blob,
  content,
  framework,
  fileNameWithExtension,
  requestId,
}) => ({
  type: EDITOR_TOP_BAR_GENERATE_SERVER_CODE_FROM_OPENAPI3_SUCCESS,
  payload: blob,
  meta: { content, framework, fileNameWithExtension, requestId },
});

export const generateServerCodeFromOpenAPI3Failure = ({ error, content, framework, requestId }) => {
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
    type: EDITOR_TOP_BAR_GENERATE_SERVER_CODE_FROM_OPENAPI3_FAILURE,
    payload: error,
    error: true,
    meta: { errorMessage, content, framework, requestId },
  };
};

/**
 * Async thunks.
 */

export const generateServerCodeFromOpenAPI3 = ({ content, framework }) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorTopBarActions, editorTopBarSelectors } = system;
    const requestId = uid();
    const url = editorTopBarSelectors.selectOpenAPI3GenerateServerURL();
    const fileNameWithExtension = `${framework}-server-generated.zip`;

    editorTopBarActions.generateServerCodeFromOpenAPI3Started({ content, framework, requestId });

    try {
      const data = { spec: YAML.load(content), lang: framework, type: 'SERVER' };
      const response = await axios.post(url, data, {
        responseType: 'blob',
      });

      fileDownload(response.data, fileNameWithExtension);

      return editorTopBarActions.generateServerCodeFromOpenAPI3Success({
        blob: response.data,
        fileNameWithExtension,
        content,
        framework,
        requestId,
      });
    } catch (error) {
      return editorTopBarActions.generateServerCodeFromOpenAPI3Failure({
        error,
        content,
        framework,
        requestId,
      });
    }
  };
};
