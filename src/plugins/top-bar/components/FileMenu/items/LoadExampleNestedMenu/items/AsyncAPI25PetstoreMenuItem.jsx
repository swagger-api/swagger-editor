import PropTypes from 'prop-types';

const AsyncAPI25PetstoreMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'AsyncAPI 2.5 Petstore'}</DropdownMenuItem>
  );
};

AsyncAPI25PetstoreMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

AsyncAPI25PetstoreMenuItem.defaultProps = {
  children: null,
};

export default AsyncAPI25PetstoreMenuItem;
