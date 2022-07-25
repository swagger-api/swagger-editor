import PropTypes from 'prop-types';

const LoadAPIDesignSystemsFixtureMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>
      {children || 'Load API Design Systems Fixture'}
    </DropdownMenuItem>
  );
};

LoadAPIDesignSystemsFixtureMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

LoadAPIDesignSystemsFixtureMenuItem.defaultProps = {
  children: null,
};

export default LoadAPIDesignSystemsFixtureMenuItem;
