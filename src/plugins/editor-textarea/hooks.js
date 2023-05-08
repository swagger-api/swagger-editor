import { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';

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
    refreshMode: 'debounce',
    refreshRate: 0,
  });

  return ref;
};

export const useId = () => {
  const randomNumber = Math.floor(Math.random() * 10000000);
  const [id] = useState(String(randomNumber));
  return id;
};
