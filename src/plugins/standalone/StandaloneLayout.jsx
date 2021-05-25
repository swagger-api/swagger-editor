import React from 'react';
import PropTypes from 'prop-types';
import './style.main.scss';

export default function StandaloneLayout(props) {
  const { getComponent } = props;
  const EditorLayout = getComponent('EditorLayout', true);
  const Topbar = getComponent('Topbar', true);

  return (
    <div>
      <Topbar />
      <EditorLayout />
    </div>
  );
}

StandaloneLayout.propTypes = {
  // specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};
