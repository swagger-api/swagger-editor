import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useResizeDetector } from 'react-resize-detector';

const EditorPane = ({ getComponent }) => {
  const [editorWidth, setEditorWidth] = useState('50');
  const [editorHeight, setEditorHeight] = useState('80vh');

  const onResize = useCallback((width, height) => {
    setEditorHeight(height);
    setEditorWidth(width);
  }, []);

  const { ref } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
    onResize,
  });

  const Editor = getComponent('Editor', true);
  const EditorPaneBarTop = getComponent('EditorPaneBarTop');

  return (
    <div className="swagger-ide__editor-pane">
      <div className="swagger-ide__editor-pane-container-col">
        <EditorPaneBarTop />
        <div ref={ref} className="swagger-ide__editor-pane-container-row">
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
