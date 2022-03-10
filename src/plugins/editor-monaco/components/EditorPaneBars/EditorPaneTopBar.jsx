import React from 'react';
import PropTypes from 'prop-types';

const EditorPaneTopBar = ({ renderChildren, renderControls, getComponent }) => {
  const ThemeSelection = getComponent('ThemeSelection', true);
  const ValidationPane = getComponent('ValidationPane', true);

  return (
    <div className="editor-pane-top-bar">
      <div className="toolbar-horizontal">{renderControls(<ThemeSelection />)}</div>
      {renderChildren(<ValidationPane />)}
    </div>
  );
};

EditorPaneTopBar.propTypes = {
  renderChildren: PropTypes.func,
  renderControls: PropTypes.func,
  getComponent: PropTypes.func.isRequired,
};

EditorPaneTopBar.defaultProps = {
  renderChildren: (children) => children,
  renderControls: (controls) => controls,
};

export default EditorPaneTopBar;
