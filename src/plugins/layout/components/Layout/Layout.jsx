import React from 'react';
import PropTypes from 'prop-types';
import { SplitPane } from 'react-collapse-pane';

const Layout = (props) => {
  const { getComponent, useSwaggerIDEReactModal } = props;
  const EditorPane = getComponent('EditorPane', true);
  const EditorPreviewPane = getComponent('EditorPreviewPane', true);
  const Topbar = getComponent('Topbar', true);
  const Container = getComponent('Container'); // accessed from swagger-ui`
  const ref = useSwaggerIDEReactModal();

  return (
    <div className="swagger-ide__layout" ref={ref}>
      <Topbar />
      <Container className="container">
        <SplitPane split="vertical">
          <EditorPane />
          <EditorPreviewPane />
        </SplitPane>
      </Container>
    </div>
  );
};

Layout.propTypes = {
  getComponent: PropTypes.func.isRequired,
  useSwaggerIDEReactModal: PropTypes.func.isRequired,
};

export default Layout;
