import React from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash/identity.js';

const EditorPaneBarTop = ({ renderChildren = identity, renderControls = identity }) => {
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

export default EditorPaneBarTop;
