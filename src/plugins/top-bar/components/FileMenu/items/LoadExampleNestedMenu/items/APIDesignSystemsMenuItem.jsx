import PropTypes from 'prop-types';

const APIDesignSystemsMenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return <DropdownMenuItem onClick={onClick}>{children || 'API Design Systems'}</DropdownMenuItem>;
};

APIDesignSystemsMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default APIDesignSystemsMenuItem;
