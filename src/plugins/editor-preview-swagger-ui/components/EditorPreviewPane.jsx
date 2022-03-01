import PropTypes from 'prop-types';

const EditorPreviewPane = ({ getComponent }) => {
  const BaseLayout = getComponent('BaseLayout', true); // accessed from swagger-ui

  return <BaseLayout />;
};

EditorPreviewPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPreviewPane;
