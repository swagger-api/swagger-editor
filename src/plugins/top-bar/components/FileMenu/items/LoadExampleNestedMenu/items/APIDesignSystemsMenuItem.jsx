import PropTypes from 'prop-types';

const APIDesignSystemsMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return <DropdownMenuItem onClick={onClick}>{children || 'API Design Systems'}</DropdownMenuItem>;
};

APIDesignSystemsMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

APIDesignSystemsMenuItem.defaultProps = {
  children: null,
};

export default APIDesignSystemsMenuItem;
