import PropTypes from 'prop-types';

const LoadAsyncAPI24PetstoreFixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>
      {children || 'Load AsyncAPI 2.4 Petstore Fixture'}
    </DropdownMenuItem>
  );
};

LoadAsyncAPI24PetstoreFixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadAsyncAPI24PetstoreFixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadAsyncAPI24PetstoreFixtureMenuItem;
