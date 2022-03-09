import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const EditorPaneTopBar = ({ getComponent }) => {
  const ValidationPane = getComponent('ValidationPane', true);
  const ThemeSelection = getComponent('ThemeSelection', true);
  const ReadOnlySelection = getComponent('ReadOnlySelection', true);
  return (
    <div className="editor-pane-top-bar">
      <div className="toolbar-horizontal">
        <ThemeSelection />
        <ReadOnlySelection />
      </div>
      <ValidationPane />
    </div>
  );
};

EditorPaneTopBar.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditorPaneTopBar;
