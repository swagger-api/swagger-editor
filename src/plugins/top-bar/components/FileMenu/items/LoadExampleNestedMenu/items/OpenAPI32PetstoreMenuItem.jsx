import PropTypes from 'prop-types';

const OpenAPI32PetstoreMenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'OpenAPI 3.2 Petstore'}</DropdownMenuItem>
  );
};

OpenAPI32PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default OpenAPI32PetstoreMenuItem;
