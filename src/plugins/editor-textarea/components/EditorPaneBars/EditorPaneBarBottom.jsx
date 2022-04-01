import React from 'react';
import PropTypes from 'prop-types';

const EditorPaneBarBottom = ({ renderChildren, renderControls }) => {
  return (
    <div className="swagger-ide__editor-pane-bar swagger-ide__editor-pane-bar--bottom">
      <div className="swagger-ide__toolbar-horizontal">{renderControls(null)}</div>
      {renderChildren(null)}
    </div>
  );
};

EditorPaneBarBottom.propTypes = {
  renderChildren: PropTypes.func,
  renderControls: PropTypes.func,
};

EditorPaneBarBottom.defaultProps = {
  renderChildren: (children) => children,
  renderControls: (controls) => controls,
};

export default EditorPaneBarBottom;
