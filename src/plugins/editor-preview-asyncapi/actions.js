import { Parser } from '@asyncapi/parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';

import { Raml10SchemaParser } from './util/parsers/raml-1-0-parser.js';

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

export const parseFailure = ({ error, parseResult, content, requestId }) => ({
  type: EDITOR_PREVIEW_ASYNCAPI_PARSE_FAILURE,
  payload: error,
  error: true,
  meta: { content, requestId, parseResult },
});

/**
 * Async thunks.
 */

export const parse = (content, options = {}) => {
  /**
   * We give ability to fully distinguish between parser and parse options.
   * If parser or parse options are not provided, we will use the options object as it is.
   */
  const { parserOptions, parseOptions } = options;
  const schemaParsers = [
    OpenAPISchemaParser(),
    AvroSchemaParser(),
    Raml10SchemaParser(),
    ProtoBuffSchemaParser(),
  ];
  const parser = new Parser({ schemaParsers, ...(parserOptions ?? options) });

  return async (system) => {
    /**
     * This code can easily be offloaded to a web worker and allow MRT
     * not to be blocked by the detection.
     */
    const { editorPreviewAsyncAPIActions, fn } = system;
    const requestId = fn.generateRequestId();

    editorPreviewAsyncAPIActions.parseStarted({ content, requestId });

    try {
      const parseResult = await parser.parse(content, parseOptions ?? options);

      if (import.meta.env.NODE_ENV === 'development') {
        parseResult.extras = null;
      }

      if (parseResult.document) {
        return editorPreviewAsyncAPIActions.parseSuccess({
          parseResult,
          content,
          requestId,
        });
      }

      return editorPreviewAsyncAPIActions.parseFailure({
        error: new Error('Document is empty'),
        parseResult,
        content,
        requestId,
      });
    } catch (error) {
      return editorPreviewAsyncAPIActions.parseFailure({
        error,
        content,
        requestId,
      });
    }
  };
};
