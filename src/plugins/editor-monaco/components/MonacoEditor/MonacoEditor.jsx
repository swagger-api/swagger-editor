import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor';
import noop from 'lodash/noop.js';

import seVsDarkTheme from '../../themes/se-vs-dark.js';
import seVsLightTheme from '../../themes/se-vs-light.js';
import { dereference } from '../../utils/monaco-action-apidom-deref.js';
import { requestGetJsonPointerPosition } from '../../utils/monaco-jump-from-path-to-line.js';
import { useMount, useUpdate, useSmoothResize } from './hooks.js';

/**
 * Hooks in MonacoEditor component are divided into 4 categories:
 *  - hooks that are executed only on mount (useMount)
 *  - hooks that are executed on mount and when values change (useEffect)
 *  - hooks that are executed only when values change after the mount (useUpdate)
 *  - rest of the hooks
 */

const MonacoEditor = ({
  value,
  theme,
  language,
  jumpToMarker,
  requestJumpToMarker,
  isReadOnly,
  onMount,
  onWillUnmount,
  onChange,
  onEditorMarkersDidChange,
  onClearJumpToMarker,
  onSetRequestJumpToMarker,
  onClearRequestJumpToMarker,
}) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const subscriptionRef = useRef(null);
  const valueRef = useRef(value);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const createEditor = useCallback(() => {
    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language,
      // semantic tokens provider is disabled by default; https://github.com/microsoft/monaco-editor/issues/1833
      'semanticHighlighting.enabled': true,
      theme,
      glyphMargin: true,
      lightbulb: {
        enabled: true,
      },
      lineNumbers: 'on',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
      wordWrap: 'on',
      minimap: {
        enabled: true,
      },
      domReadOnly: isReadOnly,
      readOnly: isReadOnly,
      wordBasedSuggestions: false,
      quickSuggestions: true,
      quickSuggestionsDelay: 300,
      fixedOverflowWidgets: true,
      'bracketPairColorization.enabled': true,
      suggest: {
        snippetsPreventQuickSuggestions: false,
      },
      renderWhitespace: true,
    });
    editorRef.current.getModel().updateOptions({ tabSize: 2 });

    setIsEditorReady(true);
  }, [value, language, theme, isReadOnly]);

  const disposeEditor = useCallback(() => {
    onWillUnmount(editorRef.current);
    subscriptionRef.current?.dispose();
    editorRef.current.getModel()?.dispose();
    editorRef.current.dispose();
  }, [onWillUnmount]);

  // disposing of Monaco Editor
  useMount(() => () => {
    if (editorRef.current) {
      disposeEditor();
    }
  });

  // defining the custom themes and setting the active one
  useMount(() => {
    monaco.editor.defineTheme('se-vs-dark', seVsDarkTheme);
    monaco.editor.defineTheme('se-vs-light', seVsLightTheme);
  });

  // update language
  useUpdate(
    () => {
      monaco.editor.setModelLanguage(editorRef.current.getModel(), language);
    },
    [language],
    isEditorReady
  );

  // track model changes from outside of editor
  useUpdate(
    () => {
      valueRef.current = value;
      if (editorRef.current.getOption(monaco.editor.EditorOption.readOnly)) {
        editorRef.current.setValue(value);
      } else if (value !== editorRef.current.getValue()) {
        editorRef.current.executeEdits('', [
          {
            range: editorRef.current.getModel().getFullModelRange(),
            text: value,
            forceMoveMarkers: true,
          },
        ]);

        editorRef.current.pushUndoStop();
      }
    },
    [value],
    isEditorReady
  );

  // jumping to markers
  useUpdate(
    () => {
      if (Object.keys(jumpToMarker).length > 0) {
        const startColumn = jumpToMarker?.startColumn || 1;
        if (startColumn && jumpToMarker?.startLineNumber) {
          editorRef.current.revealPositionNearTop({
            lineNumber: jumpToMarker.startLineNumber,
            column: startColumn,
          });
          editorRef.current.setPosition({
            lineNumber: jumpToMarker.startLineNumber,
            column: startColumn,
          });
          editorRef.current.focus();
          onClearJumpToMarker();
        }
      }
    },
    [jumpToMarker, onClearJumpToMarker],
    isEditorReady
  );

  // given a jsonPointer, request jumping to its marker position
  useUpdate(
    () => {
      async function findMarkerPosition() {
        // via apidom-ls
        const foundMarkerPosition = await requestGetJsonPointerPosition(
          editorRef.current,
          requestJumpToMarker.jsonPointer
        );
        if (foundMarkerPosition?.data) {
          // set jumpToMarker in state, which will then call the useUpdate above
          onSetRequestJumpToMarker(foundMarkerPosition.data);
          // then clear the request itself
          onClearRequestJumpToMarker();
        } else {
          // just clear the request anyway
          onClearRequestJumpToMarker();
        }
      }

      if (requestJumpToMarker?.jsonPointer && editorRef?.current?.getModel) {
        // call the async/await function
        findMarkerPosition();
      }
    },
    [requestJumpToMarker, onSetRequestJumpToMarker, onClearRequestJumpToMarker],
    isEditorReady
  );

  // setting Monaco Editor to write/read mode
  useUpdate(
    () => {
      editorRef.current.updateOptions({ domReadOnly: isReadOnly, readOnly: isReadOnly });
    },
    [isReadOnly],
    isEditorReady
  );

  // settings the theme if changed
  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  // register listener for validation markers
  useEffect(() => {
    if (!isEditorReady) return undefined;

    const disposable = monaco.editor.onDidChangeMarkers(() => {
      const markers = monaco.editor.getModelMarkers();
      onEditorMarkersDidChange(markers);
    });

    return () => {
      disposable.dispose();
    };
  }, [isEditorReady, onEditorMarkersDidChange]);

  // propagate changes from editor to handler
  useEffect(() => {
    if (isEditorReady) {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = editorRef.current?.onDidChangeModelContent((event) => {
        const editorValue = editorRef.current.getValue();

        if (valueRef.current !== editorValue) {
          valueRef.current = editorValue;
          onChange(editorValue, event);
        }
      });
    }
  }, [isEditorReady, onChange]);

  // set additional Monaco Editor actions
  useEffect(() => {
    if (isEditorReady) {
      editorRef.current.addAction({
        id: 'de-reference',
        label: 'resolve document',
        run: dereference,
      });
    }
  }, [isEditorReady]);

  // allow editor to resize to available space
  useEffect(() => {
    if (isEditorReady) {
      editorRef.current.layout();
    }
  }, [isEditorReady]);

  // notify listeners that Monaco Editor instance has been created
  useEffect(() => {
    if (isEditorReady) {
      onMount(editorRef.current);
    }
  }, [isEditorReady, onMount]);

  // creating Editor instance as last effect
  useEffect(() => {
    if (!isEditorReady && containerRef.current) {
      createEditor();
    }
  }, [isEditorReady, createEditor]);

  // handle smooth resizing of Monaco Editor
  useSmoothResize({ eventName: 'editorcontainerresize', editorRef });

  return <div ref={containerRef} className="swagger-editor__editor-monaco" />;
};

MonacoEditor.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
  jumpToMarker: PropTypes.oneOfType([PropTypes.object]),
  requestJumpToMarker: PropTypes.oneOfType([PropTypes.object]),
  onMount: PropTypes.func,
  onWillUnmount: PropTypes.func,
  onChange: PropTypes.func,
  onEditorMarkersDidChange: PropTypes.func,
  onClearJumpToMarker: PropTypes.func,
  onSetRequestJumpToMarker: PropTypes.func,
  onClearRequestJumpToMarker: PropTypes.func,
};

MonacoEditor.defaultProps = {
  isReadOnly: false,
  jumpToMarker: {},
  requestJumpToMarker: {},
  onMount: noop,
  onWillUnmount: noop,
  onChange: noop,
  onEditorMarkersDidChange: noop,
  onClearJumpToMarker: noop,
  onSetRequestJumpToMarker: noop,
  onClearRequestJumpToMarker: noop,
};

export default MonacoEditor;
