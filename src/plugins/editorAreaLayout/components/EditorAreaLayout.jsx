import React from 'react';
import PropTypes from 'prop-types';

export default function EditorAreaLayout(props) {
  const { getComponent } = props;
  const EditorWorkspace = getComponent('EditorWorkspace', true);
  // const EditorToolbarThemes = getComponent('EditorToolbarThemes', true); // NYI
  // const EditorPanelValidation = getComponent('EditorPanelValidation', true); // NYI

  return (
    <div id="editor-area-layout-wrapper" className="editor-area-layout-wrapper">
      {/* <EditorToolbarThemes /> */}
      <EditorWorkspace />
      {/* <EditorPanelValidation /> */}
    </div>
  );
}

EditorAreaLayout.propTypes = {
  getComponent: PropTypes.func.isRequired,
  // specActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  // errActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
