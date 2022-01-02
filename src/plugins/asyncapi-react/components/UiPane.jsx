import React from 'react';
import PropTypes from 'prop-types';

import { useDefinitionLanguage } from '../shared-hooks.js';

const UiPane = (props) => {
  const { getComponent, asyncapiActions } = props;

  const definitionLanguage = useDefinitionLanguage(asyncapiActions);

  const UiBaseLayout = getComponent('BaseLayout', true); // accessed from swagger-ui
  const AsyncApiComponent = getComponent('AsyncApiComponent', true);

  return (
    <div className="ui-pane">
      {definitionLanguage === 'oas' ? <UiBaseLayout /> : null}
      {definitionLanguage === 'asyncapi2' ? <AsyncApiComponent /> : null}
    </div>
  );
};

UiPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
  asyncapiActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default UiPane;
