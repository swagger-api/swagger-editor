import ShortUniqueId from 'short-unique-id';
import { detectionRegExp as detectionRegExpAsyncAPIJSON2 } from '@swagger-api/apidom-parser-adapter-asyncapi-json-2';
import { detectionRegExp as detectionRegExpAsyncAPIYAML2 } from '@swagger-api/apidom-parser-adapter-asyncapi-yaml-2';
import { detectionRegExp as detectionRegExpOpenAPIJSON31x } from '@swagger-api/apidom-parser-adapter-openapi-json-3-1';
import { detectionRegExp as detectionRegExpOpenAPIYAML31x } from '@swagger-api/apidom-parser-adapter-openapi-yaml-3-1';

/**
 * Action types.
 */
export const EDITOR_CONTENT_TYPE_DETECT_STARTED = 'editor_content_type_detect_started';
export const EDITOR_CONTENT_TYPE_DETECT_SUCCESS = 'editor_content_type_detect_success';
export const EDITOR_CONTENT_TYPE_DETECT_FAILURE = 'editor_content_type_detect_failure';

/**
 * Action creators.
 */
export const detectContentTypeStarted = ({ content, requestId }) => ({
  type: EDITOR_CONTENT_TYPE_DETECT_STARTED,
  payload: content,
  meta: {
    requestId,
  },
});

export const detectContentTypeSuccess = ({ contentType, content, requestId }) => ({
  type: EDITOR_CONTENT_TYPE_DETECT_SUCCESS,
  payload: contentType,
  meta: { content, requestId },
});

export const detectContentTypeFailure = ({ error, content, requestId }) => ({
  type: EDITOR_CONTENT_TYPE_DETECT_FAILURE,
  payload: error,
  error: true,
  meta: { content, requestId },
});

/**
 * Async thunks.
 */
export const detectContentType = (content) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    /**
     * This code can easily be offloaded to a web worker and allow MRT
     * not to be blocked by the detection.
     */
    const { editorActions, fn } = system;
    const requestId = uid();

    editorActions.detectContentTypeStarted({ content, requestId });

    try {
      const asyncApi2JSONMatch = content.match(detectionRegExpAsyncAPIJSON2);
      if (asyncApi2JSONMatch !== null && fn.isValidJSONObject(content)) {
        const { groups } = asyncApi2JSONMatch;
        const version = groups?.version_json;
        const contentType = `application/vnd.aai.asyncapi+json;version=${version}`;

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      const asyncApi2YAMLMatch = content.match(detectionRegExpAsyncAPIYAML2);
      if (asyncApi2YAMLMatch !== null && fn.isValidYAMLObject(content)) {
        const { groups } = asyncApi2YAMLMatch;
        const version = groups?.version_json || groups?.version_yaml;
        const contentType = `application/vnd.aai.asyncapi+yaml;version=${version}`;

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      const openApi20JSONMatch = content.match(/"swagger"\s*:\s*"(?<version_json>2\.0)"/);
      if (openApi20JSONMatch !== null && fn.isValidJSONObject(content)) {
        const contentType = 'application/vnd.oai.openapi+json;version=2.0';

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      const openApi2YAMLMatch = content.match(
        /(?<YAML>^(["']?)swagger\2\s*:\s*(["']?)(?<version_yaml>2\.0)\3)|(?<JSON>"asyncapi"\s*:\s*"(?<version_json>2\.0)")/m
      );
      if (openApi2YAMLMatch !== null && fn.isValidYAMLObject(content)) {
        const contentType = 'application/vnd.oai.openapi+yaml;version=2.0';

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      const openApi30xJSONMatch = content.match(/"openapi"\s*:\s*"(?<version_json>3\.0\.\d+)"/);
      if (openApi30xJSONMatch !== null && fn.isValidJSONObject(content)) {
        const { groups } = openApi30xJSONMatch;
        const version = groups?.version_json;
        const contentType = `application/vnd.oai.openapi+json;version=${version}`;

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      const openApi30xYAMLMatch = content.match(
        /(?<YAML>^(["']?)openapi\2\s*:\s*(["']?)(?<version_yaml>3\.0\.\d+)\3)|(?<JSON>"openapi"\s*:\s*"(?<version_json>3\.0\.\d+)")/m
      );
      if (openApi30xYAMLMatch !== null && fn.isValidYAMLObject(content)) {
        const { groups } = openApi30xYAMLMatch;
        const version = groups?.version_json || groups?.version_yaml;
        const contentType = `application/vnd.oai.openapi+json;version=${version}`;

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      const openApi31xJSONMatch = content.match(detectionRegExpOpenAPIJSON31x);
      if (openApi31xJSONMatch !== null && fn.isValidJSONObject(content)) {
        const { groups } = openApi31xJSONMatch;
        const version = groups?.version_json;
        const contentType = `application/vnd.oai.openapi+json;version=${version}`;

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      const openApi31xYAMLMatch = content.match(detectionRegExpOpenAPIYAML31x);
      if (openApi31xYAMLMatch !== null && fn.isValidYAMLObject(content)) {
        const { groups } = openApi31xYAMLMatch;
        const version = groups?.version_json || groups?.version_yaml;
        const contentType = `application/vnd.oai.openapi+json;version=${version}`;

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      if (fn.isValidJSON(content)) {
        const contentType = 'application/json';

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      if (fn.isValidYAML(content)) {
        const contentType = 'text/yaml';

        editorActions.detectContentTypeSuccess({ contentType, content, requestId });
        return;
      }

      editorActions.detectContentTypeFailure({
        error: new Error('No content type detected'),
        content,
        requestId,
      });
    } catch (error) {
      editorActions.detectContentTypeFailure({ error, content, requestId });
    }
  };
};
