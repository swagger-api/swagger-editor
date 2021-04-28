import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import DemoTextAreaContainer from './DemoTextAreaContainer'; // dev demo only; remove for production
// refer to parent GenericEditorContainer for additional notes

export default class EditorComponent extends PureComponent {
  render() {
    const {
      getComponent,
      specSelectors,
      onChange,
      getValueFromSpec,
      initialValue,
      // valueForDemo,
    } = this.props;

    const MonacoEditorContainer = getComponent('MonacoEditorContainer', true);

    return (
      <div id="generic-editor-wrapper" className="generic-editor-wrapper">
        {/* <DemoTextAreaContainer valueForDemo={valueForDemo} onChange={onChange} /> */}
        <MonacoEditorContainer
          initialValue={initialValue}
          getValueFromSpec={getValueFromSpec}
          onChange={onChange}
          getComponent={getComponent}
          specSelectors={specSelectors}
        />
      </div>
    );
  }
}

EditorComponent.defaultProps = {
  initialValue: '',
  // valueForDemo: '',
};

EditorComponent.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  initialValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  getValueFromSpec: PropTypes.func.isRequired,
  // valueForDemo: PropTypes.string,
};
