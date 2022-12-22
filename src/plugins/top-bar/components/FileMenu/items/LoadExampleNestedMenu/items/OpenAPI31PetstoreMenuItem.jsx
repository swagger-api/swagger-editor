import PropTypes from 'prop-types';

const OpenAPI31PetstoreMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'OpenAPI 3.1 Petstore'}</DropdownMenuItem>
  );
};

OpenAPI31PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

OpenAPI31PetstoreMenuItem.defaultProps = {
  children: null,
};

export default OpenAPI31PetstoreMenuItem;
