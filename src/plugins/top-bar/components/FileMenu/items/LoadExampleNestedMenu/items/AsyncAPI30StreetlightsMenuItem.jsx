import PropTypes from 'prop-types';

const AsyncAPI30StreetlightsMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'AsyncAPI 3.0 Streetlights'}</DropdownMenuItem>
  );
};

AsyncAPI30StreetlightsMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

AsyncAPI30StreetlightsMenuItem.defaultProps = {
  children: null,
};

export default AsyncAPI30StreetlightsMenuItem;
