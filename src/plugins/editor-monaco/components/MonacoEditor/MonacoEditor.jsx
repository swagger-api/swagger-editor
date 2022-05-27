import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor-core';

import noop from '../../../../utils/common-noop.js';
import getStyleMetadataLight, { themes as themesLight } from '../../utils/monaco-theme-light.js';
import getStyleMetadataDark, { themes as themesDark } from '../../utils/monaco-theme-dark.js';
import { dereference } from '../../utils/monaco-action-apidom-deref.js';
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
  isReadOnly,
  onEditorMount,
  onEditorWillUnmount,
  onChange,
  onEditorMarkersDidChange,
  onClearJumpToMarker,
}) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const subscriptionRef = useRef(null);
  const valueRef = useRef(null);
  const onMountRef = useRef(onEditorMount);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const createEditor = useCallback(() => {
    editorRef.current = monaco.editor.create(
      containerRef.current,
      {
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
      },
      {
        storageService: {
          get() {},
          getBoolean(key) {
            return key === 'expandSuggestionDocs';
          },
          getNumber() {
            return 0;
          },
          remove() {},
          store() {},
          onWillSaveState() {},
          onDidChangeStorage() {},
        },
      }
    );
    editorRef.current.getModel().updateOptions({ tabSize: 2 });

    setIsEditorReady(true);
  }, [value, language, theme, isReadOnly]);

  const disposeEditor = useCallback(() => {
    onEditorWillUnmount(editorRef.current);
    subscriptionRef.current?.dispose();
    editorRef.current.getModel()?.dispose();
    editorRef.current.dispose();
  }, [onEditorWillUnmount]);

  // disposing of Monaco Editor
  useMount(() => () => {
    if (editorRef.current) {
      disposeEditor();
    }
  });

  // defining the custom themes and setting the active one
  useMount(() => {
    monaco.editor.defineTheme('my-vs-dark', themesDark.seVsDark);
    monaco.editor.defineTheme('my-vs-light', themesLight.seVsLight);
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
      const editorValue = editorRef.current.getValue();

      if (value !== editorValue) {
        valueRef.current = value;
        editorRef.current.setValue(value);
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
    if (theme === 'vs-dark') {
      monaco.editor.setTheme('vs-dark');
      // eslint-disable-next-line no-underscore-dangle
      editorRef.current._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark;
    } else if (['vs-light', 'vs'].includes(theme)) {
      monaco.editor.setTheme('vs');
      // eslint-disable-next-line no-underscore-dangle
      editorRef.current._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;
    } else {
      monaco.editor.setTheme(theme);
    }
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
      onMountRef.current(editorRef.current);
    }
  }, [isEditorReady]);

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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
  jumpToMarker: PropTypes.oneOfType([PropTypes.object]),
  onEditorMount: PropTypes.func,
  onEditorWillUnmount: PropTypes.func,
  onChange: PropTypes.func,
  onEditorMarkersDidChange: PropTypes.func,
  onClearJumpToMarker: PropTypes.func,
};

MonacoEditor.defaultProps = {
  isReadOnly: false,
  jumpToMarker: {},
  onEditorMount: noop,
  onEditorWillUnmount: noop,
  onChange: noop,
  onEditorMarkersDidChange: noop,
  onClearJumpToMarker: noop,
};

export default MonacoEditor;
