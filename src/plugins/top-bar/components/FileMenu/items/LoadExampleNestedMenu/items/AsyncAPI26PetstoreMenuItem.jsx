import PropTypes from 'prop-types';

const AsyncAPI26PetstoreMenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'AsyncAPI 2.6 Petstore'}</DropdownMenuItem>
  );
};

AsyncAPI26PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default AsyncAPI26PetstoreMenuItem;
