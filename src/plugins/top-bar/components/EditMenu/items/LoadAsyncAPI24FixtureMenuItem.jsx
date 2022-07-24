import PropTypes from 'prop-types';

const LoadAsyncAPI24FixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'Load AsyncAPI 2.4 Fixture'}</DropdownMenuItem>
  );
};

LoadAsyncAPI24FixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadAsyncAPI24FixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadAsyncAPI24FixtureMenuItem;
