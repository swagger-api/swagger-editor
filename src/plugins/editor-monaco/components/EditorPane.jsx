import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useResizeDetector } from 'react-resize-detector';

const EditorPane = ({ getComponent }) => {
  const editorRef = useRef();
  const [editorWidth, setEditorWidth] = useState('50'); // 50%
  const [editorHeight, setEditorHeight] = useState('80vh');
  const [containerWidth, setContainerWidth] = useState('50%');

  const onResizeEditor = useCallback((width, height) => {
    setEditorHeight(height);
    setEditorWidth(width);
  }, []);

  useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
    onResize: onResizeEditor,
    targetRef: editorRef, // custom ref
  });

  const onResizeContainer = useCallback((width) => {
    setContainerWidth(width);
  }, []);

  // as-is, containerRef cannot use the API.targetRef like editorRef
  const { containerRef } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 100,
    onResize: onResizeContainer,
  });

  const Editor = getComponent('Editor', true);
  const EditorPaneBarTop = getComponent('EditorPaneBarTop');

  return (
    <div className="swagger-ide__editor-pane">
      <div
        ref={containerRef}
        style={{ width: containerWidth }}
        className="swagger-ide__editor-pane-container-col"
      >
        <EditorPaneBarTop />
        <div ref={editorRef} className="swagger-ide__editor-pane-container-row">
          <Editor width={editorWidth} height={editorHeight} />
        </div>
      </div>
    </div>
  );
};

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPane;
