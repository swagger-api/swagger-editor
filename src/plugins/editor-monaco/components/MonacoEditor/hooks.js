import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
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
