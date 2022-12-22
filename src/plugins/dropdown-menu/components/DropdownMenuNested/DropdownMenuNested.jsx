import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const DropdownMenuNested = ({ children, label, isLong }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <li
      className={classNames('nested-dd-menu nested-reverse', { long: isLong })}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button type="button">
        {label}&nbsp;&nbsp;<b>&gt;</b>
      </button>
      <span className="dd-item-ignore">{isOpen && <ul>{children}</ul>}</span>
    </li>
  );
};

DropdownMenuNested.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  isLong: PropTypes.bool,
};

DropdownMenuNested.defaultProps = {
  children: [],
  isLong: false,
};

export default DropdownMenuNested;
