import ShortUniqueId from 'short-unique-id';
import { parse as parseJSON } from '@swagger-api/apidom-parser-adapter-api-design-systems-json';
import { parse as parseYAML } from '@swagger-api/apidom-parser-adapter-api-design-systems-yaml';

/**
 * Action types.
 */

export const EDITOR_PREVIEW_ADS_PREVIEW_UNMOUNTED =
  'editor_preview_api_design_systems_preview_unmounted';

export const EDITOR_PREVIEW_ADS_PARSE_STARTED = 'editor_preview_api_design_systems_parse_started';
export const EDITOR_PREVIEW_ADS_PARSE_SUCCESS = 'editor_preview_api_design_systems_parse_success';
export const EDITOR_PREVIEW_ADS_PARSE_FAILURE = 'editor_preview_api_design_systems_parse_failure';

/**
 * Action creators.
 */

export const previewUnmounted = () => ({
  type: EDITOR_PREVIEW_ADS_PREVIEW_UNMOUNTED,
});

export const parseStarted = ({ content, contentType, requestId }) => ({
  type: EDITOR_PREVIEW_ADS_PARSE_STARTED,
  payload: content,
  meta: {
    contentType,
    requestId,
  },
});

export const parseSuccess = ({ parseResult, content, contentType, requestId }) => ({
  type: EDITOR_PREVIEW_ADS_PARSE_SUCCESS,
  payload: parseResult,
  meta: { content, contentType, requestId },
});

export const parseFailure = ({ error, content, contentType, requestId }) => ({
  type: EDITOR_PREVIEW_ADS_PARSE_FAILURE,
  payload: error,
  error: true,
  meta: { content, contentType, requestId },
});

/**
 * Async thunks.
 */

export const parse = ({ content, contentType, parserOptions = {} }) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorPreviewADSActions } = system;
    const requestId = uid();

    editorPreviewADSActions.parseStarted({ content, contentType, requestId });

    const parseAPIDesignSystemsDefinition = contentType.includes('+json') ? parseJSON : parseYAML;

    try {
      const parseResult = await parseAPIDesignSystemsDefinition(content, parserOptions);
      editorPreviewADSActions.parseSuccess({ parseResult, content, contentType, requestId });
    } catch (error) {
      editorPreviewADSActions.parseFailure({ error, content, contentType, requestId });
    }
  };
};
