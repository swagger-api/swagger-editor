import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * This container should contain all Swagger-internal methods,
 * which can be passed as props in an "editor"-agnostic way
 * e.g. load/lift yaml, updating redux state
 * */

/**
 * "valueForDemo" is used for DemoTextAreaContainer,
 * which is a simple html textarea that requires the computed
 * value directly from props. Computing value in child component
 * does not work.
 *
 * For plugin demonstration purposes, this container would need to
 * be converted to a wrappedComponent to reflect computing "valueForDemo".
 * EditorComponent would also have to be converted to a wrappedComponent.
 *
 * If we ever migrate to a different editor, e.g. Ace, depending on how
 * the editor handles props, this container may not need to be
 * converted to a wrappedComponent.
 */

export default class GenericEditorContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialValue: 'Welcome to Swagger Editor',
    };
  }

  componentDidMount() {
    // if needed in future
  }

  getValueFromSpec = () => {
    const { specSelectors } = this.props;
    const { initialValue } = this.state;
    // get spec from swagger-ui state.spec
    const spec = specSelectors.specStr();
    return spec || initialValue;
  };

  onChangeEditorValue = (val) => {
    const { specActions } = this.props;
    // update swagger-ui state.spec
    specActions.updateSpec(val);
  };

  render() {
    const { getComponent, specSelectors } = this.props;
    const { initialValue } = this.state;

    const EditorComponent = getComponent('EditorComponent', true);

    // const valueForDemo = JSON.stringify(this.getValueFromSpec());

    return (
      <div id="generic-editor-wrapper" className="generic-editor-wrapper">
        <EditorComponent
          initialValue={initialValue}
          getValueFromSpec={this.getValueFromSpec}
          onChange={this.onChangeEditorValue}
          getComponent={getComponent}
          specSelectors={specSelectors}
          // valueForDemo={valueForDemo}
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
