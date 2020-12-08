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
    this.initialValue = 'Welcome to Swagger Editor';
    this.currentValue = '';
  }

  componentDidMount() {
    this.getInitialValueToLoad();
  }

  componentDidUpdate() {
    this.getInitialValueToLoad();
  }

  getInitialValueToLoad = async () => {
    // Intent: await async availability of spec from swagger-ui
    // MonacoEditor should load this value just once
    // Subsequent changes should use onChange
    // Test issue: With dev hot reload, on code change,
    // initialValue appears to get reset to default in MonacoEditor,
    // but appears to re-initialize spec correctly
    // TBD, if MonacoEditor reinstantiates itself but ignoring value/prop
    // Idea, we could send this method down as a prop, or just use the onChange
    // Basically avoid possible lifecyle issue
    // Test issue: we may need to debounce
    const { specSelectors } = this.props;
    const spec = await specSelectors.specStr();
    if (!spec) {
      console.log('spec not available');
      return;
    }
    if (this.currentValue !== spec) {
      this.currentValue = spec;
      console.log('set initial spec done; should only be done once.');
    } else {
      console.log('already set. should not appear before initial spec done!!!*');
    }
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

    return (
      <div id="editor-wrapper" className="editor-wrapper">
        <MonacoEditor
          language="json"
          value={this.currentValue}
          defaultValue={this.initialValue}
          height="90vh"
          width="50"
          options={{ theme: 'vs-light' }}
        />
      </div>
    );
  }
}

MonacoEditorContainer.defaultProps = {
  onChange: noop,
};

MonacoEditorContainer.propTypes = {
  // specActions: PropTypes.object, // wip: add .isRequired when implemented
  // configsSelectors: PropTypes.object, // wip: add .isRequired when implemented
  onChange: PropTypes.func,
  // fn: PropTypes.object,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired, // wip: add .isRequired when implemented
  // errSelectors: PropTypes.object, // wip: add .isRequired when implemented
  // editorSelectors: PropTypes.object, // wip: add .isRequired when implemented
  // getComponent: PropTypes.func, // wip: add .isRequired when implemented
};
