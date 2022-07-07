import PropTypes from 'prop-types';

const EditorPreviewPane = ({ getComponent }) => {
  const EditorPreview = getComponent('EditorPreview', true);

  return (
    <div className="swagger-editor__editor-preview-pane">
      <EditorPreview />
    </div>
  );
};

EditorPreviewPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPreviewPane;
