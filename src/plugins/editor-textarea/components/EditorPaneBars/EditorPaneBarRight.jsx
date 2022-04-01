import React from 'react';
import PropTypes from 'prop-types';

const EditorPaneBarRight = ({ renderChildren, renderControls }) => {
  return (
    <div className="swagger-ide__editor-pane-bar swagger-ide__editor-pane-bar--right">
      <div className="swagger-ide__toolbar-vertical">{renderControls(null)}</div>
      {renderChildren(null)}
    </div>
  );
};

EditorPaneBarRight.propTypes = {
  renderChildren: PropTypes.func,
  renderControls: PropTypes.func,
};

EditorPaneBarRight.defaultProps = {
  renderChildren: (children) => children,
  renderControls: (controls) => controls,
};

export default EditorPaneBarRight;
