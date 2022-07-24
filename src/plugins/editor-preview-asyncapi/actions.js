import ShortUniqueId from 'short-unique-id';
import { parse as parseAsyncAPIDefinition, registerSchemaParser } from '@asyncapi/parser';
import * as openapiSchemaParser from '@asyncapi/openapi-schema-parser';
import * as avroSchemaParser from '@asyncapi/avro-schema-parser';

import * as ramlSchemaParser from './util/raml-1-0-parser.js';

registerSchemaParser(openapiSchemaParser);
registerSchemaParser(ramlSchemaParser);
registerSchemaParser(avroSchemaParser);

/**
 * Action types.
 */

export const EDITOR_PREVIEW_ASYNCAPI_PREVIEW_UNMOUNTED =
  'editor_preview_asyncapi_preview_unmounted';

export const EDITOR_PREVIEW_ASYNCAPI_PARSE_STARTED = 'editor_preview_asyncapi_parse_started';
export const EDITOR_PREVIEW_ASYNCAPI_PARSE_SUCCESS = 'editor_preview_asyncapi_parse_success';
export const EDITOR_PREVIEW_ASYNCAPI_PARSE_FAILURE = 'editor_preview_asyncapi_parse_failure';

/**
 * Action creators.
 */

export const previewUnmounted = () => ({
  type: EDITOR_PREVIEW_ASYNCAPI_PREVIEW_UNMOUNTED,
});

export const parseStarted = ({ content, requestId }) => ({
  type: EDITOR_PREVIEW_ASYNCAPI_PARSE_STARTED,
  payload: content,
  meta: {
    requestId,
  },
});

export const parseSuccess = ({ parseResult, content, requestId }) => ({
  type: EDITOR_PREVIEW_ASYNCAPI_PARSE_SUCCESS,
  payload: parseResult,
  meta: { content, requestId },
});

export const parseFailure = ({ error, content, requestId }) => ({
  type: EDITOR_PREVIEW_ASYNCAPI_PARSE_FAILURE,
  payload: error,
  error: true,
  meta: { content, requestId },
});

/**
 * Async thunks.
 */

export const parse = (content, parserOptions = {}) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    /**
     * This code can easily be offloaded to a web worker and allow MRT
     * not to be blocked by the detection.
     */
    const { editorPreviewAsyncAPIActions } = system;
    const requestId = uid();

    editorPreviewAsyncAPIActions.parseStarted({ content, requestId });

    try {
      const parseResult = await parseAsyncAPIDefinition(content, parserOptions);
      editorPreviewAsyncAPIActions.parseSuccess({ parseResult, content, requestId });
    } catch (error) {
      editorPreviewAsyncAPIActions.parseFailure({ error, content, requestId });
    }
  };
};
