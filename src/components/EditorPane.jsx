import React from 'react';
import PropTypes from 'prop-types';

/**
 * This provided default component could include component examples:
 * - EditorTextArea (default required)
 * - EditorThemeToolbar
 * - EditorValidationPane
 */

const EditorPane = (props) => {
  const { getComponent } = props;
  const EditorTextArea = getComponent('EditorTextArea', true);

  return (
    <div id="editor-pane-wrapper" className="editor-pane-wrapper">
      <EditorTextArea />
    </div>
  );
};

EditorPane.propTypes = {
  getComponent: PropTypes.func.isRequired,
  // errSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default EditorPane;
