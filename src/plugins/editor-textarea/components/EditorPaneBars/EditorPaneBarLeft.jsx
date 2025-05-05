import React from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash/identity.js';

const EditorPaneBarLeft = ({ renderChildren = identity, renderControls = identity }) => {
  return (
    <div className="swagger-editor__editor-pane-bar swagger-editor__editor-pane-bar--left">
      <div className="swagger-editor__toolbar-vertical">{renderControls(null)}</div>
      {renderChildren(null)}
    </div>
  );
};

EditorPaneBarLeft.propTypes = {
  renderChildren: PropTypes.func,
  renderControls: PropTypes.func,
};

export default EditorPaneBarLeft;
