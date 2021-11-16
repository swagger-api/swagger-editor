import React, { useEffect, useState } from 'react';
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

  // Todo: extract into a helper utiL
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);
    return debouncedValue;
  };

  const valueFromSelector = getSelectorSpecStr();
  const valueDebounced = useDebounce(valueFromSelector, 500);

  const config = {
    show: {
      errors: true, // config setting to show error pane
    },
  };

  return (
    <div id="ui-pane" className="ui-pane">
      <AsyncApiReactComponent schema={valueDebounced} config={config} />
    </div>
  );
}

AsyncApiComponent.propTypes = {
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
