// This is a pure component to change the theme for the MonacoEditor to use.
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MoonIcon, SunIcon } from '@primer/octicons-react';

import noop from '../../../utils/utils-noop';

export default class ThemeSelectionIcon extends PureComponent {
  render() {
    const { theme, onChange } = this.props;

    return (
      <div>
        {theme === 'vs' || theme === 'vs-light' || theme === 'my-vs-light' ? (
          <button type="button" className="btn" onClick={() => onChange('my-vs-dark')}>
            <MoonIcon size="small" aria-label="dark theme icon" />
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => onChange('my-vs-light')}>
            <SunIcon size="small" aria-label="light theme icon" />
          </button>
        )}
      </div>
    );
  }
}

ThemeSelectionIcon.propTypes = {
  onChange: PropTypes.func,
  theme: PropTypes.string,
};

ThemeSelectionIcon.defaultProps = {
  onChange: noop,
  theme: 'vs',
};
