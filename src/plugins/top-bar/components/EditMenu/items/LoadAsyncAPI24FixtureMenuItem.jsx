import PropTypes from 'prop-types';

const LoadAsyncAPI24FixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const DropdownMenuItemDivider = getComponent('DropdownMenuItemDivider');

  return (
    <>
      <DropdownMenuItem onClick={onClick}>
        {children || 'Load AsyncAPI 2.4 Streetlights Fixture'}
      </DropdownMenuItem>
      <DropdownMenuItemDivider />
    </>
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
