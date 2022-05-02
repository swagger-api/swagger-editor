import React from 'react';
import PropTypes from 'prop-types';

const DropdownItem = ({ onClick, name }) => {
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
};

DropdownItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default DropdownItem;
