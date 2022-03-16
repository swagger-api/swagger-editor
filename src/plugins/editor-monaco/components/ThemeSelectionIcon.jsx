import React from 'react';
import PropTypes from 'prop-types';
import { MoonIcon, SunIcon } from '@primer/octicons-react';

const themeList = ['vs', 'vs-light', 'vs-dark', 'my-vs-light', 'my-vs-dark'];
const defaultTheme = 'my-vs-dark';

const ThemeSelectionIcon = ({ editorSelectors, editorActions }) => {
  const theme = editorSelectors.selectEditorTheme() || defaultTheme;
  const handleChange = (newTheme) => () => {
    if (themeList.includes(newTheme)) {
      editorActions.updateEditorTheme(newTheme);
    }
  };

  return theme === 'vs' || theme === 'vs-light' || theme === 'my-vs-light' ? (
    <button
      type="button"
      className="swagger-ide__editor-pane-bar-control"
      onClick={handleChange('my-vs-dark')}
    >
      <MoonIcon size="small" aria-label="Dark theme" />
    </button>
  ) : (
    <button
      type="button"
      className="swagger-ide__editor-pane-bar-control"
      onClick={handleChange('my-vs-light')}
    >
      <SunIcon size="small" aria-label="Light theme" />
    </button>
  );
};

ThemeSelectionIcon.propTypes = {
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ThemeSelectionIcon;
