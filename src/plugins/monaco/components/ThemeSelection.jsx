// This is a pure component to change the theme for the MonacoEditor to use.
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import noop from '../../../utils/utils-noop';

export default class ThemeSelection extends PureComponent {
  render() {
    const { onChange } = this.props;

    return (
      <div>
        <button type="button" onClick={() => onChange('my-vs-light')}>
          vs-light
        </button>
        <button type="button" onClick={() => onChange('my-vs-dark')}>
          vs-dark
        </button>
      </div>
    );
  }
}

ThemeSelection.propTypes = {
  onChange: PropTypes.func,
};

ThemeSelection.defaultProps = {
  onChange: noop,
};
