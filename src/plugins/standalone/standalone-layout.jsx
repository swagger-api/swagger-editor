import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class StandaloneLayout extends PureComponent {
  render() {
    const { getComponent } = this.props;
    const EditorLayout = getComponent('EditorLayout', true);
    const Topbar = getComponent('Topbar', true);

    return (
      <div>
        <Topbar />
        <EditorLayout />
      </div>
    );
  }
}

StandaloneLayout.propTypes = {
  // specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};
