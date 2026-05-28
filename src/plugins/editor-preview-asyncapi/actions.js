import { toAsyncAPIDocument } from '@asyncapi/parser';

import getParserProxy, { reinitParserProxy } from './worker/parser-worker-proxy.ts';

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

export const parse =
  (content, options = {}) =>
  async (system) => {
    const { editorPreviewAsyncAPIActions, fn } = system;
    const requestId = fn.generateRequestId();

    editorPreviewAsyncAPIActions.parseStarted({ content, requestId });

    try {
      const { parserOptions, parseOptions } = options;
      await reinitParserProxy(parserOptions);
      const proxy = await getParserProxy();
      const { schema, diagnostics } = await proxy.parse(content, parseOptions ?? options);
      const document = schema ? toAsyncAPIDocument(schema) : null;

      if (document) {
        return editorPreviewAsyncAPIActions.parseSuccess({
          parseResult: { document, diagnostics },
          content,
          requestId,
        });
      }

      return editorPreviewAsyncAPIActions.parseFailure({
        error: new Error('Document is empty'),
        parseResult: { diagnostics },
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
