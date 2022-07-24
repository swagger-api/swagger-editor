import YAML from 'js-yaml';
import ShortUniqueId from 'short-unique-id';

/**
 * Action types.
 */

export const EDITOR_CONVERT_CONTENT_TO_JSON_STARTED = 'editor_convert_content_to_json_started';
export const EDITOR_CONVERT_CONTENT_TO_JSON_SUCCESS = 'editor_convert_content_to_json_success';
export const EDITOR_CONVERT_CONTENT_TO_JSON_FAILURE = 'editor_convert_content_to_json_failure';

/**
 * Action creators.
 */

export const convertContentToJSONStarted = ({ content, requestId }) => ({
  type: EDITOR_CONVERT_CONTENT_TO_JSON_STARTED,
  payload: content,
  meta: {
    requestId,
  },
});

export const convertContentToJSONSuccess = ({ contentJSON, content, requestId }) => ({
  type: EDITOR_CONVERT_CONTENT_TO_JSON_SUCCESS,
  payload: contentJSON,
  meta: { content, requestId },
});

export const convertContentToJSONFailure = ({ error, content, requestId }) => {
  const errorMessage = error.message || 'Unknown error while converting editor content to JSON';

  return {
    type: EDITOR_CONVERT_CONTENT_TO_JSON_FAILURE,
    payload: error,
    error: true,
    meta: { content, errorMessage, requestId },
  };
};

/**
 * Async thunks.
 */

export const convertContentToJSON = (content) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorActions } = system;
    const requestId = uid();

    editorActions.convertContentToJSONStarted({ content, requestId });

    try {
      const contentObject = YAML.load(content);
      const contentJSONString = JSON.stringify(contentObject, null, 2);

      return editorActions.convertContentToJSONSuccess({
        contentJSON: contentJSONString,
        content,
        requestId,
      });
    } catch (error) {
      return editorActions.convertContentToJSONFailure({ error, content, requestId });
    }
  };
};
