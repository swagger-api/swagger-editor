import React from 'react';
import PropTypes from 'prop-types';

import './_all.scss';

export default function LayoutDefault(props) {
  const { getComponent } = props;
  const EditorPane = getComponent('EditorPane', true);
  const Topbar = getComponent('Topbar', true);
  const Container = getComponent('Container'); // accessed from swagger-ui
  const SplitPaneMode = getComponent('SplitPaneMode', true);
  const UiBaseLayout = getComponent('BaseLayout', true); // accessed from swagger-ui

  return (
    <div>
      <Topbar />
      <div className="swagger-ide">
        <Container className="container">
          <SplitPaneMode split="vertical">
            <EditorPane />
            <UiBaseLayout />
          </SplitPaneMode>
        </Container>
      </div>
    </div>
  );
}

LayoutDefault.propTypes = {
  getComponent: PropTypes.func.isRequired,
  // specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
