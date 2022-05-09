/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor-core';

import noop from '../../../utils/common-noop.js';
import getStyleMetadataLight, { themes as themesLight } from '../utils/monaco-theme-light.js';
import getStyleMetadataDark, { themes as themesDark } from '../utils/monaco-theme-dark.js';
import { dereference } from '../utils/monaco-action-apidom-deref.js';
import { languageID } from '../adapters/config.js';
import { setupLanguage } from '../adapters/setup.js';

const MonacoEditorHooks = ({
  /* functions */
  onEditorMount,
  onEditorWillUnmount,
  onChange,
  editorMarkersDidChange,
  clearJumpToMarker,
  /* values */
  width,
  height,
  defaultValue,
  value,
  theme,
  language,
  jumpToMarker,
  isReadOnly,
}) => {
  const containerRef = useRef(null); // contains editorRef
  const editorRef = useRef(null); // contains monacoRef
  const monacoRef = useRef(monaco); // contains monaco Module
  const subscriptionRef = useRef(null); // track actual changes within Editor
  const valueRef = useRef(null); // track changes including outside of Editor
  const onMountRef = useRef(onEditorMount); // contains prop func
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const [markerStatus, setMarkerStatus] = useState({
    shouldUpdateMarkers: false,
    originRef: '',
    isPendingUpdate: false,
  });

  // one-time initialization setup; use subscription to track onChange of value
  if (defaultValue && !value) {
    valueRef.current = defaultValue;
  }

  const style = {
    width,
    height,
  };

  const assignRef = useCallback((node) => {
    containerRef.current = node;
  }, []);

  const createEditor = useCallback(() => {
    setupLanguage();
    editorRef.current = monacoRef.current.editor.create(
      containerRef.current,
      {
        value,
        language: languageID,
        // semantic tokens provider is disabled by default
        // https://github.com/microsoft/monaco-editor/issues/1833
        'semanticHighlighting.enabled': true,
        theme: theme || 'vs-dark',
        glyphMargin: true,
        lightbulb: {
          enabled: true,
        },
        // suggestOnTriggerCharacters: false,
        // inlineSuggest: false,
        lineNumbers: 'on',
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        wordWrap: 'on',
        minimap: {
          enabled: true, //  can track via state, and toggle via `editor.updateOptions({ minimap: { enabled: true }})`
        },
        domReadOnly: isReadOnly,
        readOnly: isReadOnly,
        wordBasedSuggestions: false,
        // quickSuggestions: false,
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
            if (key === 'expandSuggestionDocs') return true;
            return false;
          },
          // eslint-disable-next-line no-unused-vars
          getNumber(key) {
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
    // Monaco is now ready, now to setup Editor
    setIsMonacoReady(true);
  }, [isReadOnly, theme, value]);

  const destroyEditor = useCallback(() => {
    if (isMonacoReady && isEditorReady && !editorRef.current) {
      onEditorWillUnmount(editorRef.current);
      editorRef.current?.dispose();
      const model = editorRef.current.getModel();
      if (model && model?.dispose) {
        model.dispose();
      }
    }
    if (subscriptionRef?.dispose) {
      subscriptionRef.dispose();
    }
  }, [isEditorReady, isMonacoReady, onEditorWillUnmount]);

  useEffect(() => {
    if (isMonacoReady) {
      // define custom themes
      monacoRef.current.editor.defineTheme('my-vs-dark', themesDark.seVsDark);
      monacoRef.current.editor.defineTheme('my-vs-light', themesLight.seVsLight);
      // apply (default) theme
      if (!theme) {
        monacoRef.current.editor.setTheme('my-vs-dark');
      } else {
        monacoRef.current.editor.setTheme(theme);
      }
      // once theme is set, Editor is now ready
      setIsEditorReady(true);
    }
  }, [isMonacoReady, theme]);

  useEffect(() => {
    // once Editor is established, attach additional monaco actions and commands as needed
    if (isEditorReady) {
      // Add monaco actions, as needed
      // monaco actions ui tip: F1 -> resolve document
      editorRef.current.addAction({
        id: 'de-reference',
        label: 'resolve document',
        run: dereference,
      });
      // Add monaco commands, as needed
      // editorRef.current.addCommand({});
    }
  }, [isEditorReady]);

  useEffect(() => {
    // register subscription to model chanages from editor
    if (isEditorReady && onChange) {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = editorRef.current?.onDidChangeModelContent((event) => {
        const editorValue = editorRef.current.getValue();
        if (valueRef.current !== editorValue) {
          onChange(editorValue, event);
        }
      });
    }
  }, [isEditorReady, onChange]);

  useEffect(() => {
    // track model changes from outside of editor
    if (isEditorReady && valueRef.current !== value) {
      valueRef.current = value;
      editorRef.current?.setValue(value);
      if (!markerStatus.shouldUpdateMarkers && !markerStatus.isPendingUpdate) {
        // only re-run validation markers on valueRef change
        // expect subscriptionRef change to always change with valueRef change
        setMarkerStatus({
          shouldUpdateMarkers: true,
          originRef: 'valueRef',
          isPendingUpdate: true,
        });
      }
    }
  }, [isEditorReady, value, markerStatus.isPendingUpdate, markerStatus.shouldUpdateMarkers]);

  useEffect(() => {
    if (isEditorReady && language) {
      monacoRef.current.editor?.setModelLanguage(editorRef.current?.getModel(), language);
    }
  }, [isEditorReady, language]);

  useEffect(() => {
    // apply height, width to screen
    if (isEditorReady) {
      editorRef.current.layout();
    }
  }, [isEditorReady, width, height]);

  useEffect(() => {
    if (isEditorReady && theme) {
      if (theme === 'vs-dark') {
        monacoRef.current.editor.setTheme('vs-dark');
        // Apply token styles to built-in vs-dark theme default;
        // eslint-disable-next-line no-underscore-dangle
        editorRef.current._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark;
      }
      if (theme === 'vs-light' || theme === 'vs') {
        monacoRef.current.editor.setTheme('vs');
        // Apply token styles to built-in vs-light theme default;
        // eslint-disable-next-line no-underscore-dangle
        editorRef.current._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;
      }
      if (theme === 'my-vs-dark') {
        monacoRef.current.editor.setTheme('my-vs-dark');
      }
      if (theme === 'my-vs-light') {
        monacoRef.current.editor.setTheme('my-vs-light');
      }
    }
  }, [isEditorReady, theme]);

  useEffect(() => {
    // register listener for validation markers
    // we debounce to minimize calls due to multiple useEffect trying to update/clear markerStatus
    const delay = 500;
    const timer = setTimeout(() => {
      if (isEditorReady && markerStatus.shouldUpdateMarkers && markerStatus.isPendingUpdate) {
        monacoRef.current.editor.onDidChangeMarkers(() => {
          const markers = monacoRef.current.editor.getModelMarkers();
          // prevent re-run of hook from after-effects caused within this callback
          setMarkerStatus({ shouldUpdateMarkers: false, originRef: '', isPendingUpdate: false });
          // process prop function
          editorMarkersDidChange?.(markers);
          // {
          //   code: "10097"
          //   endColumn: 5
          //   endLineNumber: 2
          //   message: "should always have a 'title'"
          //   owner: "apidom"
          //   relatedInformation: undefined
          //   resource: Uri { scheme: 'inmemory', authority: 'model', path: '/1', query: '', fragment: '', … }
          //   severity: 8
          //   source: "apilint"
          //   startColumn: 1
          //   startLineNumber: 2
          //   tags: undefined
          // }
        });
        // prevent re-run of hook once async func already started
        setMarkerStatus({ shouldUpdateMarkers: false, originRef: '', isPendingUpdate: false });
      }
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [
    isEditorReady,
    markerStatus.shouldUpdateMarkers,
    markerStatus.isPendingUpdate,
    editorMarkersDidChange,
  ]);

  useEffect(() => {
    if (isEditorReady && Object.keys(jumpToMarker).length > 0 && clearJumpToMarker) {
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
        clearJumpToMarker();
      }
    }
  }, [isEditorReady, jumpToMarker, clearJumpToMarker]);

  useEffect(() => {
    if (isEditorReady) {
      editorRef.current.updateOptions({ domReadOnly: isReadOnly, readOnly: isReadOnly });
    }
  }, [isEditorReady, isReadOnly]);

  useEffect(() => {
    // first load
    if (!isMonacoReady && !isEditorReady && containerRef.current) {
      createEditor();
    }
    return () => destroyEditor();
  }, [isEditorReady, isMonacoReady, createEditor, destroyEditor]);

  useEffect(() => {
    // callback after first load
    if (isEditorReady) {
      onMountRef.current(editorRef.current, monacoRef.current);
    }
  }, [isEditorReady]);

  return <div ref={assignRef} style={style} className="swagger-ide__editor-monaco" />;
};

MonacoEditorHooks.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  isReadOnly: PropTypes.bool,
  jumpToMarker: PropTypes.oneOfType([PropTypes.object]),
  onEditorMount: PropTypes.func,
  onEditorWillUnmount: PropTypes.func,
  onChange: PropTypes.func,
  editorMarkersDidChange: PropTypes.func,
  clearJumpToMarker: PropTypes.func,
};

MonacoEditorHooks.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'apidom',
  theme: null,
  isReadOnly: false,
  jumpToMarker: {},
  onEditorMount: noop,
  onEditorWillUnmount: noop,
  onChange: noop,
  editorMarkersDidChange: noop,
  clearJumpToMarker: noop,
};

export default MonacoEditorHooks;
