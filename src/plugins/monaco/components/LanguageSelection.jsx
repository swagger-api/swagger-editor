// This is a pure component to toggle/change the language for the MonacoEditor to use.
// Intended for dev-use only
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import noop from '../../../utils/common-noop';

export default class LanguageSelection extends PureComponent {
  render() {
    const { onChange } = this.props;

    return (
      <div>
        <button type="button" onClick={() => onChange('json')}>
          json
        </button>
        <button type="button" onClick={() => onChange('yaml')}>
          yaml
        </button>
        <button type="button" onClick={() => onChange('detect')}>
          detect
        </button>
      </div>
    );
  }
}

LanguageSelection.propTypes = {
  onChange: PropTypes.func,
};

LanguageSelection.defaultProps = {
  onChange: noop,
};
