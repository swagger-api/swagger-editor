/* eslint-disable no-unused-vars */
/* eslint-diable react/forbid-prop-types */
/* eslint-diable react/no-unused-prop-types */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from './MonacoEditor'; // wip: will refactor to use getComponent instead of import

function noop() {} // export to utils later

// Todo: add additional handlers in this container, for any Swagger-internal implmentation requirements
// e.g. load/lift yaml, updating redux state
export default class MonacoEditorContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValue: 'Welcome to Swagger Editor',
      currentValue: null,
      specInitialized: false,
    };
    this.onChangeEditorValue = this.onChangeEditorValue.bind(this);
    this.editorDidMount = this.editorDidMount.bind(this);
  }

  componentDidMount() {
    this.getInitialValueToLoad();
  }

  componentDidUpdate() {
    // console.log('container componentDidUpdate');
    const { specInitialized } = this.state;
    if (!specInitialized) {
      this.getInitialValueToLoad();
    }
  }

  getInitialValueToLoad = async () => {
    // Intent: await async availability of spec from swagger-ui
    // MonacoEditor should load this value just once
    // Subsequent changes should use onChange
    const { specSelectors } = this.props;
    const { specInitialized, currentValue } = this.state;
    const spec = await specSelectors.specStr();
    if (!spec) {
      console.log('spec not available');
      return;
    }
    if (specInitialized) {
      console.log('spec already initialized (once only)');
      return;
    }
    if (spec && !currentValue && currentValue !== spec) {
      // this.currentValue = spec;
      // console.log('currentValue !== spec, spec:', spec);
      // console.log('currentValue !== spec, currentValue:', currentValue);
      this.setState({ currentValue: spec, specInitialized: true });
      console.log('set initial spec done; should only be done once.');
    } else {
      console.log('already set. should not appear before initial spec done!!!*');
    }
  };

  onChangeEditorValue = (val) => {
    console.log('attempt to onChangeEditorValue.');
    const { specActions } = this.props;
    // update swagger-ui state.spec
    specActions.updateSpec(val);
    // update editor value
    this.setState({ currentValue: val });
  };

  editorDidMount = (editor) => {
    editor.focus();
    // console.log('container editor mounted, should focus');
  };

  render() {
    const {
      // specSelectors,
      // getComponent,
      // errSelectors,
      // fn,
      // editorSelectors,
      // configsSelectors,
      onChange,
    } = this.props; // wip: Remove line 1: "eslint-disable no-unused-vars" as this.props gets built out
    // const MonacoEditor = getComponent('MonacoEditor');
    // const monacoEditorOptions = {};
    const { initialValue, currentValue } = this.state;

    return (
      <div id="editor-wrapper" className="editor-wrapper">
        <MonacoEditor
          language="json"
          value={currentValue}
          defaultValue={initialValue}
          height="90vh"
          width="50"
          options={{ theme: 'vs-light' }}
          onChange={this.onChangeEditorValue}
          editorDidMount={this.editorDidMount}
        />
      </div>
    );
  }
}

MonacoEditorContainer.defaultProps = {
  onChange: noop,
};

MonacoEditorContainer.propTypes = {
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // configsSelectors: PropTypes.object, // wip: add .isRequired when implemented
  onChange: PropTypes.func,
  // fn: PropTypes.object,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errSelectors: PropTypes.object, // wip: add .isRequired when implemented
  // editorSelectors: PropTypes.object, // wip: add .isRequired when implemented
  // getComponent: PropTypes.func, // wip: add .isRequired when implemented
};
