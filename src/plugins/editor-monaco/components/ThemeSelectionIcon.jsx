import React from 'react';
import PropTypes from 'prop-types';
import { MoonIcon, SunIcon } from '@primer/octicons-react';

const ThemeSelectionIcon = ({ editorSelectors, editorActions }) => {
  const theme = editorSelectors.selectTheme();

  const handleChange = (newTheme) => () => {
    editorActions.setTheme(newTheme);
  };

  return theme === 'se-vs-dark' ? (
    <div className="swagger-editor__generic-padding-thin-top-bottom">
      <button
        type="button"
        className="swagger-editor__editor-pane-bar-control"
        onClick={handleChange('se-vs-light')}
      >
        <SunIcon size="small" aria-label="Light theme" />
      </button>
    </div>
  ) : (
    <div className="swagger-editor__generic-padding-thin-top-bottom">
      <button
        type="button"
        className="swagger-editor__editor-pane-bar-control"
        onClick={handleChange('se-vs-dark')}
      >
        <MoonIcon size="small" aria-label="Dark theme" />
      </button>
    </div>
  );
};

ThemeSelectionIcon.propTypes = {
  editorActions: PropTypes.shape({
    setTheme: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectTheme: PropTypes.func.isRequired,
  }).isRequired,
};

export default ThemeSelectionIcon;
