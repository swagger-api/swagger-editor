import YAML from 'js-yaml';
import ShortUniqueId from 'short-unique-id';

/**
 * Action types.
 */

export const EDITOR_CONVERT_CONTENT_TO_YAML_STARTED = 'editor_convert_content_to_yaml_started';
export const EDITOR_CONVERT_CONTENT_TO_YAML_SUCCESS = 'editor_convert_content_to_yaml_success';
export const EDITOR_CONVERT_CONTENT_TO_YAML_FAILURE = 'editor_convert_content_to_yaml_failure';

/**
 * Action creators.
 */

export const convertContentToYAMLStarted = ({ content, requestId }) => ({
  type: EDITOR_CONVERT_CONTENT_TO_YAML_STARTED,
  payload: content,
  meta: {
    requestId,
  },
});

export const convertContentToYAMLSuccess = ({ contentYAML, content, requestId }) => ({
  type: EDITOR_CONVERT_CONTENT_TO_YAML_SUCCESS,
  payload: contentYAML,
  meta: { content, requestId },
});

export const convertContentToYAMLFailure = ({ error, content, requestId }) => {
  const errorMessage = error.message || 'Unknown error while converting editor content to JSON';

  return {
    type: EDITOR_CONVERT_CONTENT_TO_YAML_FAILURE,
    payload: error,
    error: true,
    meta: { content, errorMessage, requestId },
  };
};

/**
 * Async thunks.
 */

export const convertContentToYAML = (content) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorActions } = system;
    const requestId = uid();

    editorActions.convertContentToYAMLStarted({ content, requestId });

    try {
      const contentObject = JSON.parse(content);
      const contentYAMLString = YAML.dump(contentObject);

      return editorActions.convertContentToYAMLSuccess({
        contentYAML: contentYAMLString,
        content,
        requestId,
      });
    } catch (error) {
      return editorActions.convertContentToYAMLFailure({ error, content, requestId });
    }
  };
};
