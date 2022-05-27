import React from 'react';
import PropTypes from 'prop-types';

const EditorPaneBarTop = ({ renderChildren, renderControls }) => {
  return (
    <div className="swagger-editor__editor-pane-bar swagger-editor__editor-pane-bar--top">
      <div className="swagger-editor__toolbar-horizontal">{renderControls(null)}</div>
      {renderChildren(null)}
    </div>
  );
};

EditorPaneBarTop.propTypes = {
  renderChildren: PropTypes.func,
  renderControls: PropTypes.func,
};

EditorPaneBarTop.defaultProps = {
  renderChildren: (children) => children,
  renderControls: (controls) => controls,
};

export default EditorPaneBarTop;
