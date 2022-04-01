import PropTypes from 'prop-types';

const EditorPane = ({ getComponent }) => {
  const Editor = getComponent('Editor', true);
  const EditorPaneBarTop = getComponent('EditorPaneBarTop');
  const EditorPaneBarRight = getComponent('EditorPaneBarRight');
  const EditorPaneBarBottom = getComponent('EditorPaneBarBottom');
  const EditorPaneBarLeft = getComponent('EditorPaneBarLeft');

  return (
    <div className="swagger-ide__editor-pane">
      <div className="swagger-ide__editor-pane-container-col">
        <EditorPaneBarTop />
        <div className="swagger-ide__editor-pane-container-row">
          <EditorPaneBarLeft />
          <Editor />
        </div>
        <EditorPaneBarBottom />
      </div>
      <EditorPaneBarRight />
    </div>
  );
};

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPane;
