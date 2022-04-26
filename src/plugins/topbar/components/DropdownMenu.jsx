/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = (props) => {
  const dropdownRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { children, displayName } = props;

  const handleClickOutside = (event) => {
    if (dropdownRef && !dropdownRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dd-menu dd-menu-left" ref={dropdownRef}>
      <span
        className="menu-item"
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isExpanded}
        onClick={handleToggleClick}
      >
        {displayName}
      </span>
      {isExpanded && (
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

Dropdown.propTypes = {
  displayName: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

Dropdown.defaultProps = {
  children: [],
};

export default Dropdown;
