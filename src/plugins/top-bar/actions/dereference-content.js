import * as monaco from 'monaco-editor';

/**
 * Action types.
 */

export const EDITOR_DEREFERENCE_CONTENT_STARTED = 'editor_dereference_content_started';
export const EDITOR_DEREFERENCE_CONTENT_SUCCESS = 'editor_dereference_content_success';
export const EDITOR_DEREFERENCE_CONTENT_FAILURE = 'editor_dereference_content_failure';

/**
 * Action creators.
 */

export const dereferenceContentStarted = ({ content, baseURI, requestId }) => ({
  type: EDITOR_DEREFERENCE_CONTENT_STARTED,
  payload: content,
  meta: {
    baseURI,
    requestId,
  },
});

export const dereferenceContentSuccess = ({
  contentDereferenced,
  content,
  baseURI,
  requestId,
}) => ({
  type: EDITOR_DEREFERENCE_CONTENT_SUCCESS,
  payload: contentDereferenced,
  meta: { content, baseURI, requestId },
});

export const dereferenceContentFailure = ({ error, content, baseURI, requestId }) => {
  const errorMessage = error.message || 'Unknown error while dereferencing editor content';

  return {
    type: EDITOR_DEREFERENCE_CONTENT_FAILURE,
    payload: error,
    error: true,
    meta: { content, errorMessage, baseURI, requestId },
  };
};

/**
 * Async thunks.
 */

export const dereferenceContent =
  ({ content, baseURI }) =>
  async (system) => {
    const { editorActions, fn } = system;
    const requestId = fn.generateRequestId();

    editorActions.dereferenceContentStarted({ content, baseURI, requestId });

    try {
      const model = monaco.editor.getModels().find((m) => m.getValue() === content);
      const worker = await fn.getApiDOMWorker()(model.uri);
      const contentDereferenced = await worker.doDeref(model.uri.toString(), {
        baseURI: baseURI ?? globalThis.location.href,
      });

      return editorActions.dereferenceContentSuccess({
        contentDereferenced,
        content,
        baseURI,
        requestId,
      });
    } catch (error) {
      return editorActions.dereferenceContentFailure({ error, content, baseURI, requestId });
    }
  };
