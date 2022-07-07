import PropTypes from 'prop-types';

const ClearMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return <DropdownMenuItem onClick={onClick}>{children || 'Clear'}</DropdownMenuItem>;
};

ClearMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

ClearMenuItem.defaultProps = {
  children: null,
};

export default ClearMenuItem;
