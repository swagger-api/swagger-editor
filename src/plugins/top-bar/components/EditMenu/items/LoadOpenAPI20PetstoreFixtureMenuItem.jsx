import PropTypes from 'prop-types';

const LoadOpenAPI20PetstoreFixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>
      {children || 'Load OpenAPI 2.0 Petstore Fixture'}
    </DropdownMenuItem>
  );
};

LoadOpenAPI20PetstoreFixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadOpenAPI20PetstoreFixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadOpenAPI20PetstoreFixtureMenuItem;
