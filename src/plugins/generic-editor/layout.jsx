import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './style.main.scss';

export default class EditorLayout extends PureComponent {
  render() {
    const { getComponent, specActions, specSelectors } = this.props;

    const UIBaseLayout = getComponent('BaseLayout', true);
    const GenericEditorContainer = getComponent('GenericEditorContainer', true);
    const SplitPaneMode = getComponent('SplitPaneMode', true);
    const Container = getComponent('Container');

    return (
      <div className="swagger-editor">
        <Container className="container">
          <SplitPaneMode>
            <GenericEditorContainer
              specActions={specActions}
              getComponent={getComponent}
              specSelectors={specSelectors}
            />
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
  specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
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
