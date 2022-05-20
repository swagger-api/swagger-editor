import { useEffect, useRef } from 'react';

export const useMount = (effect) => {
  useEffect(effect, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useUpdate = (effect, deps, applyChanges = true) => {
  const isInitialMount = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    isInitialMount.current || !applyChanges
      ? () => {
          isInitialMount.current = false;
        }
      : effect,
    deps
  );
};

export const useSmoothResize = ({ eventName, editorRef }) => {
  useEffect(() => {
    let lastDimensions = {};
    let currentDimensions = {};
    let breakAnimationFrame = false;

    const handleEditorContainerResize = ({ detail }) => {
      currentDimensions = detail;
    };

    function handleEditorResize() {
      if (breakAnimationFrame) return;

      if (
        lastDimensions.width !== currentDimensions.width ||
        lastDimensions.height !== currentDimensions.height
      ) {
        editorRef.current.layout();
        lastDimensions = currentDimensions;
      }

      globalThis.requestAnimationFrame(handleEditorResize);
    }

    globalThis.requestAnimationFrame(handleEditorResize);

    globalThis.addEventListener(eventName, handleEditorContainerResize);

    return () => {
      breakAnimationFrame = true;
      globalThis.removeEventListener(eventName, handleEditorContainerResize);
    };
  }, [eventName, editorRef]);
};
