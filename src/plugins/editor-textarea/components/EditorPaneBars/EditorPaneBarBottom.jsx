import React from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash/identity.js';

const EditorPaneBarBottom = ({ renderChildren = identity, renderControls = identity }) => {
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

export default EditorPaneBarBottom;
