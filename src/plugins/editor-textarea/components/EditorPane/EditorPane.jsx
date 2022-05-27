import PropTypes from 'prop-types';

const EditorPane = ({ getComponent, useElementResize }) => {
  const Editor = getComponent('Editor', true);
  const EditorPaneBarTop = getComponent('EditorPaneBarTop');
  const EditorPaneBarRight = getComponent('EditorPaneBarRight');
  const EditorPaneBarBottom = getComponent('EditorPaneBarBottom');
  const EditorPaneBarLeft = getComponent('EditorPaneBarLeft');
  const editorContainerRef = useElementResize({ eventName: 'editorcontainerresize' });

  return (
    <div className="swagger-editor__editor-pane">
      <div className="swagger-editor__editor-pane-container-col">
        <EditorPaneBarTop />
        <div className="swagger-editor__editor-pane-container-row">
          <EditorPaneBarLeft />
          <div className="swagger-editor__editor-container" ref={editorContainerRef}>
            <Editor />
          </div>
        </div>
        <EditorPaneBarBottom />
      </div>
      <EditorPaneBarRight />
    </div>
  );
};

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
  useElementResize: PropTypes.func.isRequired,
};

export default EditorPane;
