import PropTypes from 'prop-types';

const LoadOpenAPI30PetstoreFixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>
      {children || 'Load OpenAPI 3.0 Petstore Fixture'}
    </DropdownMenuItem>
  );
};

LoadOpenAPI30PetstoreFixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadOpenAPI30PetstoreFixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadOpenAPI30PetstoreFixtureMenuItem;
