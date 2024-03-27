import ShortUniqueId from 'short-unique-id';
import { Parser } from '@asyncapi/parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';

import { Raml10SchemaParser } from './util/raml-1-0-parser.js';

const parser = new Parser();
parser.registerSchemaParser(OpenAPISchemaParser());
parser.registerSchemaParser(AvroSchemaParser());
parser.registerSchemaParser(Raml10SchemaParser());
parser.registerSchemaParser(ProtoBuffSchemaParser());

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
      const parseResult = await parser.parse(content, parserOptions);

      if (parseResult.document) {
        editorPreviewAsyncAPIActions.parseSuccess({ parseResult, content, requestId });
      } else {
        editorPreviewAsyncAPIActions.parseFailure({
          error: new Error('Document is empty'),
          parseResult,
          content,
          requestId,
        });
      }
    } catch (error) {
      editorPreviewAsyncAPIActions.parseFailure({ error, content, requestId });
    }
  };
};
