import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/click-events-have-key-events */

const DropdownMenu = ({ children, label, isLong }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (ref.current !== null && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={classNames('dd-menu dd-menu-left', { long: isLong })} ref={ref}>
      <span
        className="menu-item"
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={handleToggleClick}
      >
        {label}
      </span>
      {isOpen && (
        <div
          className="dd-menu-items"
          aria-labelledby="Dropdown"
          onClick={handleToggleClick}
          role="menu"
          tabIndex={0}
        >
          <ul className="dd-items-left">{children}</ul>
        </div>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  isLong: PropTypes.bool,
};

DropdownMenu.defaultProps = {
  children: [],
  isLong: false,
};

export default DropdownMenu;
