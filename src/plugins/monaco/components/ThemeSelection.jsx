// This is a pure component to change the theme for the MonacoEditor to use.
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import noop from '../../../utils/common-noop';

export default class ThemeSelection extends PureComponent {
  render() {
    const { onChange } = this.props;

    return (
      <div>
        <button type="button" onClick={() => onChange('my-vs-light')}>
          swagger-light
        </button>
        <button type="button" onClick={() => onChange('my-vs-dark')}>
          swagger-dark
        </button>
        <button type="button" onClick={() => onChange('vs-light')}>
          vs-light
        </button>
        <button type="button" onClick={() => onChange('vs-dark')}>
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
