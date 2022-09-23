import ShortUniqueId from 'short-unique-id';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getLanguageService } from '@swagger-api/apidom-ls';

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

export const dereferenceContent = ({ content, baseURI, fileExtension }) => {
  const uid = new ShortUniqueId({ length: 10 });

  return async (system) => {
    const { editorActions } = system;
    const requestId = uid();

    editorActions.dereferenceContentStarted({ content, baseURI, requestId });

    const languageService = getLanguageService({});
    try {
      const document = TextDocument.create(`file://filename${fileExtension}`, 'apidom', 0, content);
      const contentDereferenced = await languageService.doDeref(document, {
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
    } finally {
      languageService.terminate();
    }
  };
};
