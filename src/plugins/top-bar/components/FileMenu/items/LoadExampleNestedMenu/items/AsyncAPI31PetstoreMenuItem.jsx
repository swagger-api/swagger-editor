import PropTypes from 'prop-types';

const AsyncAPI31PetstoreMenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'AsyncAPI 3.1 Petstore'}</DropdownMenuItem>
  );
};

AsyncAPI31PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default AsyncAPI31PetstoreMenuItem;
