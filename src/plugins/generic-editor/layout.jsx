import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class EditorLayout extends PureComponent {
  render() {
    const { getComponent } = this.props;

    const UIBaseLayout = getComponent('BaseLayout', true);
    const MonacoEditorContainer = getComponent('MonacoEditorContainer', true);
    const SplitPaneMode = getComponent('SplitPaneMode', true);
    const Container = getComponent('Container');

    return (
      <div className="swagger-editor">
        <h2>Render a page heading</h2>
        <Container className="container">
          <SplitPaneMode>
            <MonacoEditorContainer />
            <UIBaseLayout />
          </SplitPaneMode>
        </Container>
      </div>
    );
  }
}

EditorLayout.propTypes = {
  // errSelectors: PropTypes.object.isRequired,
  // errActions: PropTypes.object.isRequired,
  // specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  // layoutSelectors: PropTypes.object.isRequired,
  // layoutActions: PropTypes.object.isRequired,
};

EditorLayout.defaultProps = {
  // errSelectors: PropTypes.object.isRequired,
  // errActions: PropTypes.object.isRequired,
  // specActions: PropTypes.object.isRequired,
  // layoutSelectors: PropTypes.object.isRequired,
  // layoutActions: PropTypes.object.isRequired,
};
