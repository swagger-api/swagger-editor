import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class DropdownItem extends PureComponent {
  render() {
    const { onClick, name } = this.props;
    return (
      <div>
        <li className="dropdown-item">
          <button type="button" onClick={onClick}>
            {' '}
            {name}{' '}
          </button>
        </li>
      </div>
    );
  }
}

DropdownItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};
