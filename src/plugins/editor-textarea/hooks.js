import { useCallback, useEffect, useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';

// eslint-disable-next-line import/prefer-default-export
export const makeUseEditorLifecycle = (getSystem) => (implementation) => {
  const { editorActions } = getSystem();
  const editorRef = useRef(null);

  useEffect(() => {
    const { current } = editorRef;
    editorActions.editorSetup(current, implementation);

    return () => {
      editorActions.editorTearDown(current, implementation);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return editorRef;
};

export const useElementResize = ({ eventName }) => {
  const handleResize = useCallback(
    (width, height) => {
      const event = new globalThis.CustomEvent(eventName, {
        detail: { width, height },
      });
      globalThis.dispatchEvent(event);
    },
    [eventName]
  );
  const { ref } = useResizeDetector({
    onResize: handleResize,
  });

  return ref;
};
