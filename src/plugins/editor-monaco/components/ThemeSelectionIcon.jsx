import React from 'react';
import PropTypes from 'prop-types';
import { MoonIcon, SunIcon } from '@primer/octicons-react';

const themeList = ['vs', 'vs-light', 'vs-dark', 'my-vs-light', 'my-vs-dark'];
const defaultTheme = 'my-vs-dark';

const ThemeSelectionIcon = ({ editorSelectors, editorActions }) => {
  const theme = editorSelectors.getEditorTheme() || defaultTheme;
  const handleChange = (newTheme) => () => {
    if (themeList.includes(newTheme)) {
      editorActions.updateEditorTheme(newTheme);
    }
  };

  return (
    <div>
      {theme === 'vs' || theme === 'vs-light' || theme === 'my-vs-light' ? (
        <button type="button" className="btn btn-theme-icon" onClick={handleChange('my-vs-dark')}>
          <MoonIcon size="small" aria-label="dark theme icon" />
        </button>
      ) : (
        <button type="button" className="btn btn-theme-icon" onClick={handleChange('my-vs-light')}>
          <SunIcon size="small" aria-label="light theme icon" />
        </button>
      )}
    </div>
  );
};

ThemeSelectionIcon.propTypes = {
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ThemeSelectionIcon;
