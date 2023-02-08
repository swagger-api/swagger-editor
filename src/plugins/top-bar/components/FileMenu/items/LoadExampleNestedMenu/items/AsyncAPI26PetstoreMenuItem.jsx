import PropTypes from 'prop-types';

const AsyncAPI26PetstoreMenuItem = ({ getComponent, onClick, children }) => {
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

AsyncAPI26PetstoreMenuItem.defaultProps = {
  children: null,
};

export default AsyncAPI26PetstoreMenuItem;
