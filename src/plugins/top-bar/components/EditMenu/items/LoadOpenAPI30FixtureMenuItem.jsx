import PropTypes from 'prop-types';

const LoadOpenAPI30FixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'Load OpenAPI 3.0 Fixture'}</DropdownMenuItem>
  );
};

LoadOpenAPI30FixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadOpenAPI30FixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadOpenAPI30FixtureMenuItem;
