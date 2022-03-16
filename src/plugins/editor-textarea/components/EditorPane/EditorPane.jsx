import PropTypes from 'prop-types';

const EditorPane = ({ getComponent }) => {
  const Editor = getComponent('Editor', true);
  const EditorPaneTopBar = getComponent('EditorPaneBarTop', true);

  return (
    <div className="swagger-ide__editor-pane">
      <EditorPaneTopBar />
      <Editor />
    </div>
  );
};

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPane;
