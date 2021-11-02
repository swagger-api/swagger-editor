import React from 'react';
import PropTypes from 'prop-types';
import AsyncApiReactComponent from '@asyncapi/react-component';
import '@asyncapi/react-component/styles/default.min.css';

export default function AsyncApiComponent(props) {
  const getSelectorSpecStr = () => {
    const { specSelectors } = props;
    const initialValue = 'Welcome to the AsyncAPI React Component';
    // get spec from swagger-ui state.spec
    const spec = specSelectors.specStr();
    return spec || initialValue;
  };

  const valueForDemo = getSelectorSpecStr();

  const config = {
    show: {
      errors: true, // config setting to show error pane
    },
  };

  return (
    <div id="ui-pane" className="ui-pane">
      <AsyncApiReactComponent schema={valueForDemo} config={config} />
    </div>
  );
}

AsyncApiComponent.propTypes = {
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
