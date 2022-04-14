import { useEffect, useRef } from 'react';

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
