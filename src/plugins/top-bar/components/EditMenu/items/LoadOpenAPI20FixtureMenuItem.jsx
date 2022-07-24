import PropTypes from 'prop-types';

const LoadOpenAPI20FixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'Load OpenAPI 2.0 Fixture'}</DropdownMenuItem>
  );
};

LoadOpenAPI20FixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadOpenAPI20FixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadOpenAPI20FixtureMenuItem;
