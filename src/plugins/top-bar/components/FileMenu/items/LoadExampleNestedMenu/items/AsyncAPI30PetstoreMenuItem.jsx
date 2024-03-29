import PropTypes from 'prop-types';

const AsyncAPI30PetstoreMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'AsyncAPI 3.0 Petstore'}</DropdownMenuItem>
  );
};

AsyncAPI30PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

AsyncAPI30PetstoreMenuItem.defaultProps = {
  children: null,
};

export default AsyncAPI30PetstoreMenuItem;
