import React from 'react';
import PropTypes from 'prop-types';
import { SplitPane } from 'react-collapse-pane';

import Dropzone from '../../../../components/Dropzone.jsx';

const Layout = (props) => {
  const { getComponent, useSwaggerIDEReactModal, specActions } = props;
  const EditorPane = getComponent('EditorPane', true);
  const EditorPreviewPane = getComponent('EditorPreviewPane', true);
  const Topbar = getComponent('Topbar', true);
  const Container = getComponent('Container'); // accessed from swagger-ui`
  const ref = useSwaggerIDEReactModal();

  const handleChange = (newYaml, origin = 'editor') => {
    specActions.updateSpec(newYaml, origin);
  };

  return (
    <div className="swagger-ide__layout" ref={ref}>
      <Topbar />
      <Container className="container">
        <Dropzone onDrop={handleChange} getComponent={getComponent}>
          <SplitPane split="vertical">
            <EditorPane />
            <EditorPreviewPane />
          </SplitPane>
        </Dropzone>
      </Container>
    </div>
  );
};

Layout.propTypes = {
  getComponent: PropTypes.func.isRequired,
  useSwaggerIDEReactModal: PropTypes.func.isRequired,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default Layout;
