import PropTypes from 'prop-types';

const OpenAPI20PetstoreMenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'OpenAPI 2.0 Petstore'}</DropdownMenuItem>
  );
};

OpenAPI20PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default OpenAPI20PetstoreMenuItem;
