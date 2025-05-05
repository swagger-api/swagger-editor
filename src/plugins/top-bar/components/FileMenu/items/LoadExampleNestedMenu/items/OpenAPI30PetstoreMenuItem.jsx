import PropTypes from 'prop-types';

const OpenAPI30PetstoreMenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'OpenAPI 3.0 Petstore'}</DropdownMenuItem>
  );
};

OpenAPI30PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default OpenAPI30PetstoreMenuItem;
