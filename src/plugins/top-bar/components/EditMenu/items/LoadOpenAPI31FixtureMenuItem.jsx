import PropTypes from 'prop-types';

const LoadOpenAPI31FixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'Load OpenAPI 3.1 Fixture'}</DropdownMenuItem>
  );
};

LoadOpenAPI31FixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadOpenAPI31FixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadOpenAPI31FixtureMenuItem;
