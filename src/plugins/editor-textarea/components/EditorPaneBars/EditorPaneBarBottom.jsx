import React from 'react';
import PropTypes from 'prop-types';

const EditorPaneBarBottom = ({ renderChildren, renderControls }) => {
  return (
    <div className="swagger-editor__editor-pane-bar swagger-editor__editor-pane-bar--bottom">
      <div className="swagger-editor__toolbar-horizontal">{renderControls(null)}</div>
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
