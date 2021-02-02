import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DemoTextAreaContainer from './DemoTextAreaContainer'; // dev demo only; remove for production

/**
 * This container should contain all Swagger-internal methods,
 * which can be passed as props in an "editor"-agnostic way
 * e.g. load/lift yaml, updating redux state
 * */

export default class GenericEditorContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValue: 'Welcome to Swagger Editor',
      specInitialized: false,
    };
    this.onChangeEditorValue = this.onChangeEditorValue.bind(this);
    this.getValueFromSpec = this.getValueFromSpec.bind(this);
  }

  componentDidMount() {
    // this.getInitialValueToLoad();
  }

  componentDidUpdate() {
    // const { specInitialized } = this.state;
    // if (!specInitialized) {
    //   console.log('container componentDidUpdate. calling getInitialValueToLoad');
    //   this.getInitialValueToLoad();
    // }
  }

  getInitialValueToLoad = async () => {
    // Update: this method should be deprecated, as we now use "getValueFromSpec()" in child render
    // Intent: await async availability of spec from swagger-ui
    // MonacoEditor should load this value just once
    // Subsequent changes should use onChange
    const { specSelectors } = this.props;
    const { specInitialized } = this.state;
    const spec = await specSelectors.specStr();
    if (!spec) {
      // console.log('spec not available');
      return;
    }
    if (specInitialized) {
      // console.log('spec already initialized (once only)');
      return;
    }
    if (spec) {
      // this.currentValue = spec;
      // console.log('currentValue !== spec, spec:', spec);
      // console.log('currentValue !== spec, currentValue:', currentValue);
      this.setState({ specInitialized: true });
      // console.log('set initial spec done; should only be done once.');
    } else {
      // console.log('already set. should not appear before initial spec done!!!*');
    }
  };

  getValueFromSpec = () => {
    const { specSelectors } = this.props;
    const { initialValue } = this.state;
    // get spec from swagger-ui state.spec
    const spec = specSelectors.specStr();
    return spec || initialValue;
  };

  onChangeEditorValue = (val) => {
    // console.log('attempt to onChangeEditorValue.');
    const { specActions } = this.props;
    // update swagger-ui state.spec
    specActions.updateSpec(val);
  };

  render() {
    const { getComponent, specSelectors } = this.props;
    const { initialValue } = this.state;

    const MonacoEditorContainer = getComponent('MonacoEditorContainer', true);

    const valueForDemo = JSON.stringify(this.getValueFromSpec());

    return (
      <div id="generic-editor-wrapper" className="generic-editor-wrapper">
        <DemoTextAreaContainer valueForDemo={valueForDemo} onChange={this.onChangeEditorValue} />
        <MonacoEditorContainer
          initialValue={initialValue}
          getValueFromSpec={this.getValueFromSpec}
          onChange={this.onChangeEditorValue}
          getComponent={getComponent}
          specSelectors={specSelectors}
        />
      </div>
    );
  }
}

GenericEditorContainer.defaultProps = {};

GenericEditorContainer.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // configsSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
