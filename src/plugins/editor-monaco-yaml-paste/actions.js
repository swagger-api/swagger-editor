/**
 * Action types.
 */
export const EDITOR_TRANSFORM_DIALOG_CLOSE = 'editor_transform_dialog_close';
export const EDITOR_TRANSFORM_DIALOG_OPEN_STARTED = 'editor_transform_dialog_open_started';
export const EDITOR_TRANSFORM_DIALOG_OPEN_SUCCESS = 'editor_transform_dialog_open_success';
export const EDITOR_TRANSFORM_DIALOG_OPEN_FAILURE = 'editor_transform_dialog_open_failure';
export const EDITOR_TRANSFORM_CLIPBOARD_DATA_STARTED = 'editor_transform_clipboard_data_started';
export const EDITOR_TRANSFORM_CLIPBOARD_DATA_SUCCESS = 'editor_transform_clipboard_data_success';
export const EDITOR_TRANSFORM_CLIPBOARD_DATA_FAILURE = 'editor_transform_clipboard_data_failure';

/**
 * Action creators.
 */
export const closeTransformDialog = () => ({
  type: EDITOR_TRANSFORM_DIALOG_CLOSE,
});

export const transformClipboardDataStarted = ({ text, range, requestId }) => ({
  type: EDITOR_TRANSFORM_CLIPBOARD_DATA_STARTED,
  payload: text,
  meta: {
    range,
    requestId,
  },
});

export const transformClipboardDataSuccess = ({ text, range, requestId }) => ({
  type: EDITOR_TRANSFORM_CLIPBOARD_DATA_SUCCESS,
  payload: text,
  meta: { range, requestId },
});

export const transformClipboardDataFailure = ({ error, text, range, requestId }) => ({
  type: EDITOR_TRANSFORM_CLIPBOARD_DATA_FAILURE,
  payload: error,
  error: true,
  meta: { text, range, requestId },
});

export const openTransformDialogStarted = ({ text, range, requestId }) => ({
  type: EDITOR_TRANSFORM_DIALOG_OPEN_STARTED,
  payload: text,
  meta: {
    range,
    requestId,
  },
});

export const openTransformDialogSuccess = ({ text, range, requestId }) => ({
  type: EDITOR_TRANSFORM_DIALOG_OPEN_SUCCESS,
  payload: text,
  meta: { range, requestId },
});

export const openTransformDialogFailure = ({ error, text, range, requestId }) => ({
  type: EDITOR_TRANSFORM_DIALOG_OPEN_FAILURE,
  payload: error,
  error: true,
  meta: { text, range, requestId },
});

export const openTransformDialog =
  ({ text, range }) =>
  (system) => {
    const { editorMonacoYAMLPasteActions, editorSelectors, fn } = system;
    const requestId = fn.generateRequestId();

    editorMonacoYAMLPasteActions.openTransformDialogStarted({ text, range, requestId });

    try {
      const isValidJSON = fn.isValidJSONObject(text) || fn.isValidJSONArray(text);
      const isReplacingEntireEditorContent = editorSelectors.selectEditor().getValue() === text;
      const isPreviousEditorContentFormatYAML = editorSelectors.selectIsContentFormatYAML();

      if (isValidJSON && (isReplacingEntireEditorContent || isPreviousEditorContentFormatYAML)) {
        editorMonacoYAMLPasteActions.openTransformDialogSuccess({ text, range, requestId });
      } else {
        throw new Error('Cannot convert clipboard data to YAML.');
      }
    } catch (error) {
      editorMonacoYAMLPasteActions.openTransformDialogFailure({
        error,
        text,
        range,
        requestId,
      });
    }
  };

export const transformClipboardData =
  ({ text, range }) =>
  async (system) => {
    const { editorActions, editorSelectors, editorMonacoYAMLPasteActions, fn } = system;
    const requestId = fn.generateRequestId();

    editorMonacoYAMLPasteActions.transformClipboardDataStarted({ text, range, requestId });

    try {
      const fsa = await editorActions.convertContentToYAML(text);

      if (fsa.error) {
        throw fsa;
      }

      const padding = ' '.repeat(range.startColumn - 1);

      const textWithPadding = fsa.payload
        .split('\n')
        .map((line, i) => (i === 0 ? line : padding + line)) // don't pad first line, it's already indented
        .join('\n')
        .replace(/\t/g, '  '); // tabs -> spaces, just to be sure

      const editor = editorSelectors.selectEditor();
      editor.executeEdits('', [{ range, text: textWithPadding, forceMoveMarkers: true }]);

      return editorMonacoYAMLPasteActions.transformClipboardDataSuccess({
        text: fsa.payload,
        range,
        requestId,
      });
    } catch (error) {
      return editorMonacoYAMLPasteActions.transformClipboardDataFailure({
        error,
        text,
        range,
        requestId,
      });
    }
  };
