import React from 'react';
import PropTypes from 'prop-types';

import '../style.main.scss';

export default function IdeLayout(props) {
  const { getComponent } = props;
  const EditorAreaLayout = getComponent('EditorAreaLayout', true);
  const Topbar = getComponent('Topbar', true);
  const Container = getComponent('Container'); // accessed from swagger-ui
  const SplitPaneMode = getComponent('SplitPaneMode', true);
  const UiBaseLayout = getComponent('BaseLayout', true); // accessed from swagger-ui

  return (
    <div>
      <Topbar />
      <div className="swagger-editor">
        <Container className="container">
          <SplitPaneMode>
            <EditorAreaLayout />
            <UiBaseLayout />
          </SplitPaneMode>
        </Container>
      </div>
    </div>
  );
}

IdeLayout.propTypes = {
  getComponent: PropTypes.func.isRequired,
  // specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
