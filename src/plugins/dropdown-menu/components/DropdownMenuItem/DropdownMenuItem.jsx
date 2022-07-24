import React from 'react';
import PropTypes from 'prop-types';

const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <div>
      <li className="dropdown-item">
        <button type="button" onClick={onClick}>
          {children}
        </button>
      </li>
    </div>
  );
};

DropdownMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DropdownMenuItem;
