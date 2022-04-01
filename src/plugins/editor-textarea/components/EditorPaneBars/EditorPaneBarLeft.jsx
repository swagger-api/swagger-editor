import React from 'react';
import PropTypes from 'prop-types';

const EditorPaneBarLeft = ({ renderChildren, renderControls }) => {
  return (
    <div className="swagger-ide__editor-pane-bar swagger-ide__editor-pane-bar--left">
      <div className="swagger-ide__toolbar-vertical">{renderControls(null)}</div>
      {renderChildren(null)}
    </div>
  );
};

EditorPaneBarLeft.propTypes = {
  renderChildren: PropTypes.func,
  renderControls: PropTypes.func,
};

EditorPaneBarLeft.defaultProps = {
  renderChildren: (children) => children,
  renderControls: (controls) => controls,
};

export default EditorPaneBarLeft;
