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
          value="hello there"
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
  // specSelectors: PropTypes.object, // wip: add .isRequired when implemented
  // errSelectors: PropTypes.object, // wip: add .isRequired when implemented
  // editorSelectors: PropTypes.object, // wip: add .isRequired when implemented
  // getComponent: PropTypes.func, // wip: add .isRequired when implemented
};
