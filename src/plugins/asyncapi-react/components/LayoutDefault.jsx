import React from 'react';
import PropTypes from 'prop-types';

import UiPane from './UiPane';

export default function LayoutDefault(props) {
  const { getComponent, asyncapiActions } = props;
  const EditorPane = getComponent('EditorPane', true);
  const Topbar = getComponent('Topbar', true);
  const Container = getComponent('Container'); // accessed from swagger-ui
  const SplitPaneMode = getComponent('SplitPaneMode', true);

  return (
    <div>
      <Topbar />
      <div className="swagger-ide">
        <Container className="container">
          <SplitPaneMode>
            <EditorPane />
            <UiPane getComponent={getComponent} asyncapiActions={asyncapiActions} />
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
  asyncapiActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
