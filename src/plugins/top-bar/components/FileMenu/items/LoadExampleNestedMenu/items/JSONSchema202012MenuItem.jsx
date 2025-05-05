import PropTypes from 'prop-types';

const JSONSchema202012MenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return <DropdownMenuItem onClick={onClick}>{children || 'JSON Schema 2020-12'}</DropdownMenuItem>;
};

JSONSchema202012MenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default JSONSchema202012MenuItem;
